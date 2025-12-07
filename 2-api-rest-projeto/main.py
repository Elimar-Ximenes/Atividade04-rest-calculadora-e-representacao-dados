from fastapi import FastAPI
from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
import requests
from dicttoxml import dicttoxml

app = FastAPI()

@app.get("/")
def root():
    return {"message": "API funcionando"}

favorites = []

# =============================================
# POST /endpoint para adicionar paises favoritos
# =============================================
@app.post("/favorites")
def add_favorite(data: dict):
    code = data.get("code")

    if not code:
        raise HTTPException(status_code=400, detail="O campo 'code' é obrigatório.")

    # Consulta API externa RestCountries
    url = f"https://restcountries.com/v3.1/alpha/{code}"
    resp = requests.get(url)

    if resp.status_code != 200:
        raise HTTPException(status_code=404, detail="País não encontrado.")

    country = resp.json()[0]

    # Extrai dados úteis
    item = {
        "code": code.lower(),
        "name": country["name"]["common"],
        "capital": country.get("capital", ["N/A"])[0],
        "region": country.get("region", "N/A"),
        "population": country.get("population", 0),
        "flag": country["flags"].get("png"),   # <--- aqui
        "comment": ""
    }


    # Evitar duplicação
    if any(f["code"] == item["code"] for f in favorites):
        raise HTTPException(status_code=409, detail="País já está nos favoritos.")

    favorites.append(item)
    return {"message": "Favorito adicionado com sucesso", "item": item}


# =============================
# GET /favorites
# =============================
@app.get("/favorites")
def get_favorites(format: str = "json"):

    if format == "xml":
        xml_data = dicttoxml(favorites, custom_root="favorites", attr_type=False)
        return Response(content=xml_data, media_type="application/xml")

    return favorites


# =============================
# DELETE /favorites/{code}
# =============================
@app.delete("/favorites/{code}")
def delete_favorite(code: str):

    for item in favorites:
        if item["code"] == code.lower():
            favorites.remove(item)
            return {"message": "Favorito removido"}

    raise HTTPException(status_code=404, detail="País não está na lista de favoritos.")

# =============================
# PUT /favorites/{code}
# Adiciona ou atualiza um comentário sobre o país
# =============================
@app.put("/favorites/{code}")
def update_favorite_comment(code: str, data: dict):

    comment = data.get("comment")

    if not comment:
        raise HTTPException(status_code=400, detail="O campo 'comment' é obrigatório.")

    for item in favorites:
        if item["code"] == code.lower():
            item["comment"] = comment  # cria ou atualiza o comentário
            return {
                "message": "Comentário atualizado com sucesso",
                "item": item
            }

    raise HTTPException(status_code=404, detail="País não está na lista de favoritos.")

