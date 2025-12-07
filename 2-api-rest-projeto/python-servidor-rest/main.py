from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse, Response
import httpx
from models import FavoriteRequest, UpdateFavoriteRequest
from typing import Optional
from utils import to_xml, to_protobuf
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Country REST API", version="1.0.0")

# HABILITAR CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

favorites = []
votes = []
countries_cache = None

# ====================================================
# Função para obter país da API externa
# ====================================================
async def fetch_country(code: str):
    url = f"https://restcountries.com/v3.1/alpha/{code}?fields=name,cca3,region,flags"

    async with httpx.AsyncClient() as client:
        resp = await client.get(url)

    if resp.status_code != 200:
        return None

    data = resp.json()

    # A API retorna sempre um objeto único neste formato
    c = data

    return {
        "name": c.get("name", {}).get("common", "Unknown"),
        "code": c.get("cca3", ""),
        "region": c.get("region", "Unknown"),
        "flag": c.get("flags", {}).get("png", "")
    }

# ====================================================
# CRUD FAVORITES
# ====================================================

@app.get("/favorites")
async def get_favorites(format: str = Query("json", enum=["json", "xml"])):
    response = {"favorites": favorites}

    if format == "xml":
        return to_xml(response)

    return JSONResponse(response)


@app.post("/favorites")
async def add_favorite(req: FavoriteRequest):
    country = await fetch_country(req.code)

    if not country:
        return JSONResponse({"error": "Código inválido"}, status_code=400)

    # ---- Verificar duplicado ----
    for fav in favorites:
        if fav["code"].upper() == country["code"].upper():
            return JSONResponse(
                {"error": "O país já está na lista de favoritos"},
                status_code=409
            )

    # ---- Criar entrada nova ----
    favorite_entry = {
        "name": country["name"],
        "code": country["code"],
        "region": country["region"],
        "flag": country["flag"],
        "comment": req.comment
    }

    favorites.append(favorite_entry)

    return {
        "message": "Adicionado aos favoritos",
        "favorites": favorites
    }

@app.put("/favorites/{code}")
async def update_favorite(code: str, req: UpdateFavoriteRequest):
    for fav in favorites:
        if fav["code"] == code:
            if req.comment is not None:
                fav["comment"] = req.comment
            
            return {
                "message": "Favorito atualizado",
                "favorite": fav
            }

    return JSONResponse({"error": "País não encontrado nos favoritos"}, status_code=404)


@app.delete("/favorites/{code}")
async def delete_favorite(code: str):
    global favorites
    before = len(favorites)

    favorites = [c for c in favorites if c["code"] != code]

    if len(favorites) == before:
        return JSONResponse({"error": "País não encontrado"}, status_code=404)

    return {"message": "Removido", "favorites": favorites}


# ====================================================
# SISTEMA DE VOTAÇÃO
# ====================================================
@app.post("/votes/{code}")
async def vote(code: str):
    country = await fetch_country(code)

    if not country:
        return JSONResponse({"error": "Código inválido"}, status_code=400)

    # --- Verifica se país já existe na lista ---
    for v in votes:
        if v["code"] == code:
            v["votes"] += 1
            return {
                "message": "Voto registrado",
                "country": v
            }

    # --- Se não existir, cria entrada ---
    vote_entry = {
        "name": country["name"],
        "code": country["code"],
        "region": country["region"],
        "flag": country["flag"],
        "votes": 1
    }

    votes.append(vote_entry)

    return {
        "message": "Voto registrado",
        "country": vote_entry
    }


@app.get("/votes/ranking")
async def vote_ranking(limit: Optional[int] = Query(None, ge=1)):
    ranking = sorted(votes, key=lambda x: x["votes"], reverse=True)

    # Se limit não foi informado → retorna todos
    if limit is not None:
        ranking = ranking[:limit]

    return {"ranking": ranking}


# ====================================================
# ROTA COM PROTOBUF
# ====================================================
@app.get("/countries")
async def get_countries(format: str = Query("json", enum=["json", "xml", "protobuf"])):
    global countries_cache

    if countries_cache is None:
        async with httpx.AsyncClient() as client:
            resp = await client.get("https://restcountries.com/v3.1/all?fields=name,cca3,region,flags")
        raw = resp.json()

        countries_cache = []
        for c in raw:
            countries_cache.append({
                "name": c.get("name", {}).get("common", "Unknown"),
                "code": c.get("cca3", ""),
                "region": c.get("region", "Unknown"),
                "flag": c.get("flags", {}).get("png", "")
            })

    data = {"countries": countries_cache}

    # JSON
    if format == "json":
        return data

    # XML  
    if format == "xml":
        return to_xml(data)

    # PROTOBUF
    if format == "protobuf":
        return to_protobuf(countries_cache)

    return JSONResponse({"error": "Formato inválido"}, status_code=400)