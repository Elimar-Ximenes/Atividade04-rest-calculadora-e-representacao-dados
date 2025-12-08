/* ==============================
   VARIÁVEIS
============================== */
let countries = [];
let selectedCountry = null;
let currentEditCode = null;

/* ==============================
   CARREGAR PAÍSES (PROTOBUF)
============================== */
async function loadCountries() {
    try {
        const root = await protobuf.load("proto/countries.proto");
        const CountryList = root.lookupType("CountryList");

        const response = await fetch("http://127.0.0.1:8000/countries?format=protobuf");
        const buffer = await response.arrayBuffer();
        const bytes = new Uint8Array(buffer);

        const decoded = CountryList.decode(bytes);
        const json = CountryList.toObject(decoded);

        countries = json.countries;
        fillSelect(countries);

    } catch (err) {
        console.error("Erro ao carregar países (protobuf):", err);
    }
}

function fillSelect(list) {
    const select = document.getElementById("country-select");
    select.innerHTML = "";
    list.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.code;
        opt.textContent = `${c.name} (${c.code})`;
        select.appendChild(opt);
    });
}

document.getElementById("search").addEventListener("input", (e) => {
    const text = e.target.value.toLowerCase();
    const filtered = countries.filter(c => c.name.toLowerCase().includes(text));
    fillSelect(filtered);
});

document.getElementById("country-select").addEventListener("change", (e) => {
    const code = e.target.value;
    selectedCountry = countries.find(c => c.code === code);

    document.getElementById("country-info").innerHTML = `
        <h3>${selectedCountry.name}</h3>
        <img src="${selectedCountry.flag}">
    `;

    document.getElementById("btn-fav").disabled = false;
    document.getElementById("btn-vote").disabled = false;
});

/* ==============================
   MODAL
============================== */
function openModal(title, html) {
    document.getElementById("modal-title").innerText = title;
    document.getElementById("modal-content").innerHTML = html;
    document.getElementById("modal-overlay").style.display = "flex";
}

function closeModal() {
    document.getElementById("modal-overlay").style.display = "none";
}

/* ==============================
   FAVORITAR
============================== */
document.getElementById("btn-fav").addEventListener("click", () => {
    if (!selectedCountry) return;

    openModal("Adicionar aos Favoritos", `
        <p><strong>${selectedCountry.name}</strong></p>
        <img src="${selectedCountry.flag}" width="140">
        <br><br>
        <textarea id="comment" class="form-control" placeholder="Digite um comentário"></textarea>
        <button class="btn btn-primary w-100 mt-3" onclick="sendFavorite()">Salvar</button>
    `);
});

async function sendFavorite() {
    const comment = document.getElementById("comment").value;

    try {
        const response = await fetch("http://127.0.0.1:8000/favorites", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                code: selectedCountry.code,
                comment: comment
            })
        });

        if (!response.ok) {
            const data = await response.json();
            const errorMsg = data.error || "Erro desconhecido";

            document.getElementById("modal-content").insertAdjacentHTML(
                "afterbegin",
                `<div class="alert alert-danger">${errorMsg}</div>`
            );
            return;
        }

        closeModal();
        loadFavorites();

    } catch (err) {
        document.getElementById("modal-content").insertAdjacentHTML(
            "afterbegin",
            `<div class="alert alert-danger">Falha ao comunicar com o servidor.</div>`
        );
    }
}

/* ==============================
   VOTAR
============================== */
document.getElementById("btn-vote").addEventListener("click", () => {
    openModal("Confirmar Voto", `
        <p><strong>${selectedCountry.name}</strong></p>
        <img src="${selectedCountry.flag}" width="140">
        <br><br>
        <button class="btn btn-success w-100" onclick="sendVote()">Confirmar voto</button>
    `);
});

async function sendVote() {
    await fetch(`http://127.0.0.1:8000/votes/${selectedCountry.code}`, { method: "POST" });
    closeModal();
    loadRanking();
}

/* ==============================
   LISTAR FAVORITOS
============================== */
async function loadFavorites() {
    const res = await fetch("http://127.0.0.1:8000/favorites?format=json");
    const data = await res.json();

    const container = document.getElementById("favoritesList");
    container.innerHTML = "";

    data.favorites.forEach(fav => {
        container.innerHTML += `
            <div class="card shadow-sm">
                <img src="${fav.flag}" class="card-img-top">
                <div class="card-body">
                    <h5>${fav.name} (${fav.code})</h5>
                    <p class="text-muted">${fav.region}</p>
                    <p><strong>Comentário:</strong> ${fav.comment || "<i>Sem comentário</i>"}</p>

                    <button class="btn btn-warning btn-sm" onclick="openEdit('${fav.code}', \`${fav.comment}\`)">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteFavorite('${fav.code}')">Remover</button>
                </div>
            </div>
        `;
    });
}

function openEdit(code, comment) {
    currentEditCode = code;
    openModal("Editar Comentário", `
        <textarea id="editComment" class="form-control">${comment}</textarea>
        <button class="btn btn-primary w-100 mt-3" onclick="confirmEdit()">Salvar</button>
    `);
}

async function confirmEdit() {
    const newComment = document.getElementById("editComment").value;

    await fetch(`http://127.0.0.1:8000/favorites/${currentEditCode}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ comment: newComment })
    });

    closeModal();
    loadFavorites();
}

async function deleteFavorite(code) {
    await fetch(`http://127.0.0.1:8000/favorites/${code}`, { method: "DELETE" });
    loadFavorites();
}

/* ==============================
   RANKING
============================== */
async function loadRanking() {
    const res = await fetch("http://127.0.0.1:8000/votes/ranking?limit=10");
    const data = await res.json();

    const container = document.getElementById("rankingList");
    container.innerHTML = "";

    data.ranking.forEach(item => {
        container.innerHTML += `
            <div class="card shadow-sm">
                <img src="${item.flag}" class="card-img-top">
                <div class="card-body text-center">
                    <h5>${item.name} (${item.code})</h5>
                    <span class="badge bg-primary">⭐ ${item.votes} votos</span>
                </div>
            </div>
        `;
    });
}

/* ==============================
   INICIALIZAÇÃO
============================== */
loadCountries();
loadFavorites();
loadRanking();
