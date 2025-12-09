# 📘 API de Países – Projeto REST

Este projeto implementa uma API REST de Países usando FastAPI, além de dois clientes (Web e Mobile) para consumo da API e um arquivo de especificação OpenAPI.

 ## Link do vídeo no YouTube: https://youtu.be/8wPoyz8a0YY 

 ## 1. Servidor REST (FastAPI)
 O servidor consulta a API externa **[RestCountries](https://restcountries.com/)**, mantém listas locais de favoritos e votos e expõe rotas para CRUD e ranking.

 ### Rotas principais
 
- `GET /countries` – Lista todos os países existentes
- `GET /favorites` – Lista os países favoritos
- `POST /favorites` – Adiciona país favorito
- `PUT /favorites/{code}` – Atualiza comentário sobre o país favorito
- `DELETE /favorites/{code}` – Remove o país favorito
- `POST /votes/{code}` – Registra voto sobre algum país
- `GET /votes/ranking` – Retorna ranking dos países mais votados

### Formatos suportados

- JSON
- XML → `?format=xml`
- Protobuf → `Content-Type: application/x-protobuf`

### Como executar

`cd python-servidor-rest`

`pip install -r requirements.txt`

`uvicorn main:app --reload`

## 2. Cliente Web (HTML/CSS/JS)

Cliente simples para consumo da API, permitindo: **Listar países**, **Buscar**, **Favoritar**, **Votar** e **Visualizar ranking** dos top 10 países mais votados

### Imagem interface Cliente-web

![cliente-web](https://github.com/user-attachments/assets/380c9ec4-6aab-4a17-87fd-94dc5584a13b)

### Como executar

Abra no navegador:

`cliente-web/index.html`

## 3. Cliente Mobile (React Native / Expo)

Aplicativo mobile com as mesmas funcionalidades do cliente web.

### Como executar

`cd cliente-mobile`
 
 `npm install`
 
 `npx expo start`

### Imagem da interface mobile

<img src="https://github.com/user-attachments/assets/83d0a98e-7bdd-416a-bf2d-9315638584c4" width="300" />

## 4. Especificação OpenAPI

Arquivo YAML contendo toda a descrição das rotas, modelos e formatos da API:

[`ESPECIFICACAO-OPEN-API-PAISES.yaml`](https://github.com/Elimar-Ximenes/Atividade04-rest-calculadora-e-representacao-dados/blob/main/2-api-rest-projeto/ESPECIFICACAO-OPEN-API-PAISES.yaml)

### Agora basta copiar e colar o conteúdo do arquivo (YAML) no editor Swagger abaixo para visualizar a documentação:

- https://editor.swagger.io
- Extensão "OpenAPI" no VSCode

### Imagem da documentação OpenAPI no Swagger Editor

![openAPI](https://github.com/user-attachments/assets/5b127f2c-6a55-43a0-8c9e-480a8c417806)




