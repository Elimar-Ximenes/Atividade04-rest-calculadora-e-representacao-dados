const BASE_URL = "https://calculadora-fxpc.onrender.com";

window.onload = function () {
    carregarOperacoes();
};

// ====================== GET /operations ======================
async function carregarOperacoes() {
    try {
        const response = await fetch(BASE_URL + "/operations");
        const data = await response.json();

        const combo = document.getElementById("operacoes");
        combo.innerHTML = "";

        // data.operations é uma lista de objetos
        data.operations.forEach(op => {
            const option = document.createElement("option");
            option.value = op.name.toLowerCase(); 
            option.textContent = op.name;
            combo.appendChild(option);
        });

    } catch (e) {
        alert("Erro ao carregar operações: " + e.message);
    }
}

// ====================== POST /operation/{op}/{a}/{b} ======================
async function calcular() {
    const op1 = document.getElementById("op1").value;
    const op2 = document.getElementById("op2").value;
    const operacao = document.getElementById("operacoes").value;

    if (!op1 || !op2) {
        alert("Preencha os dois valores!");
        return;
    }

    const url = `${BASE_URL}/operation/${operacao}/${op1}/${op2}`;

    try {
        const response = await fetch(url, {
            method: "POST"
        });

        const data = await response.json();

        document.getElementById("resultado-texto").innerText = data.result;

    } catch (e) {
        document.getElementById("resultado-texto").innerText = "Erro";
        console.error(e);
    }
}
