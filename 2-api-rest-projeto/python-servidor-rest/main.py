from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse, Response
import httpx
from models import FavoriteRequest, UpdateFavoriteRequest
from typing import Optional
from utils import to_xml, to_protobuf
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Country REST API", version="1.0.0")

# ====================================================
# CORS
# ====================================================
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

    c = resp.json()

    return {
        "name": c.get("name", {}).get("common", "Unknown"),
        "code": c.get("cca3", ""),
        "region": c.get("region", "Unknown"),
        "flag": c.get("flags", {}).get("png", "")
    }


# ====================================================
# FAVORITES CRUD
# ====================================================

@app.get("/favorites")
async def get_favorites(format: str = Query("json", enum=["json", "xml"])):
    response = {"favorites": favorites}

    if format == "xml":
        return to_xml(response)

    return JSONResponse(response)


@app.post("/favorites")
async def add_favorite(
    req: FavoriteRequest,
    format: str = Query("json", enum=["json", "xml"])
):
    country = await fetch_country(req.code)

    if not country:
        error = {"error": "Código inválido"}
        return to_xml(error) if format == "xml" else JSONResponse(error, status_code=400)

    # Verificar duplicado
    for fav in favorites:
        if fav["code"].upper() == country["code"].upper():
            error = {"error": "O país já está na lista de favoritos"}
            return to_xml(error) if format == "xml" else JSONResponse(error, status_code=409)

    favorite_entry = {
        "name": country["name"],
        "code": country["code"],
        "region": country["region"],
        "flag": country["flag"],
        "comment": req.comment
    }

    favorites.append(favorite_entry)

    response = {"message": "Adicionado aos favoritos", "favorites": favorites}
    return to_xml(response) if format == "xml" else response


@app.put("/favorites/{code}")
async def update_favorite(
    code: str,
    req: UpdateFavoriteRequest,
    format: str = Query("json", enum=["json", "xml"])
):
    for fav in favorites:
        if fav["code"] == code:
            fav["comment"] = req.comment

            response = {"message": "Favorito atualizado", "favorite": fav}
            return to_xml(response) if format == "xml" else response

    error = {"error": "País não encontrado nos favoritos"}
    return to_xml(error) if format == "xml" else JSONResponse(error, status_code=404)


@app.delete("/favorites/{code}")
async def delete_favorite(
    code: str,
    format: str = Query("json", enum=["json", "xml"])
):
    global favorites
    before = len(favorites)

    favorites = [c for c in favorites if c["code"] != code]

    if len(favorites) == before:
        error = {"error": "País não encontrado"}
        return to_xml(error) if format == "xml" else JSONResponse(error, status_code=404)

    response = {"message": "Removido", "favorites": favorites}
    return to_xml(response) if format == "xml" else response


# ====================================================
# SISTEMA DE VOTAÇÃO
# ====================================================
@app.post("/votes/{code}")
async def vote(code: str, format: str = Query("json", enum=["json", "xml"])):
    country = await fetch_country(code)

    if not country:
        error = {"error": "Código inválido"}
        return to_xml(error) if format == "xml" else JSONResponse(error, status_code=400)

    # Verifica se país já tem votos
    for v in votes:
        if v["code"] == code:
            v["votes"] += 1
            response = {"message": "Voto registrado", "country": v}
            return to_xml(response) if format == "xml" else response

    vote_entry = {
        "name": country["name"],
        "code": country["code"],
        "region": country["region"],
        "flag": country["flag"],
        "votes": 1
    }

    votes.append(vote_entry)

    response = {"message": "Voto registrado", "country": vote_entry}
    return to_xml(response) if format == "xml" else response


@app.get("/votes/ranking")
async def vote_ranking(
    limit: Optional[int] = Query(None, ge=1),
    format: str = Query("json", enum=["json", "xml"])
):
    ranking = sorted(votes, key=lambda x: x["votes"], reverse=True)

    if limit:
        ranking = ranking[:limit]

    response = {"ranking": ranking}
    return to_xml(response) if format == "xml" else response


# ====================================================
# COUNTRIES LIST + PROTOBUF
# ====================================================
@app.get("/countries")
async def get_countries(format: str = Query("json", enum=["json", "xml", "protobuf"])):
    global countries_cache

    if countries_cache is None:
        async with httpx.AsyncClient() as client:
            resp = await client.get("https://restcountries.com/v3.1/all?fields=name,cca3,region,flags")
        raw = resp.json()

        countries_cache = [
            {
                "name": c.get("name", {}).get("common", "Unknown"),
                "code": c.get("cca3", ""),
                "region": c.get("region", "Unknown"),
                "flag": c.get("flags", {}).get("png", "")
            }
            for c in raw
        ]

    data = {"countries": countries_cache}

    if format == "json":
        return data
    if format == "xml":
        return to_xml(data)
    if format == "protobuf":
        return to_protobuf(countries_cache)

    return data