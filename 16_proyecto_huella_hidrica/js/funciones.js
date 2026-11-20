class LoteTela {
    constructor(id, tipoFibra, kilogramos) {
        this.id = id;
        this.tipoFibra = tipoFibra;
        this.kilogramos = kilogramos;
    }
}

const selectFibra = document.getElementById("tipoFibra");
const inputKilos = document.getElementById("kilosTela");
const btn = document.getElementById("btnCalcular");
const lista = document.getElementById("historialLotes");
const aguaTotalTexto = document.getElementById("aguaTotal");

document.addEventListener("DOMContentLoaded", cargarLotes);
btn.addEventListener("click", agregarLote);

function agregarLote() {
    const fibra = selectFibra.value;
    const kilos = Number(inputKilos.value.trim());

    if (kilos <= 0) {
        return alert("Por favor ingrese una cantidad válida de kilogramos");
    }

    const lotes = obtenerLotes();
    const nuevoLote = new LoteTela(lotes.length + 1, fibra, kilos);

    lotes.push(nuevoLote);
    localStorage.setItem("lotes", JSON.stringify(lotes));

    mostrarLotes();
    inputKilos.value = "";
}

function obtenerLotes() {
    return JSON.parse(localStorage.getItem("lotes")) || [];
}

function mostrarLotes() {
    const lotes = obtenerLotes();
    lista.innerHTML = "";
    let totalAcumulado = 0;

    lotes.forEach((lote) => {
        let aguaLote = 0;
        if (lote.tipoFibra === "algodon") {
            aguaLote = lote.kilogramos * 10000;
        } else {
            aguaLote = lote.kilogramos * 300;
        }

        totalAcumulado += aguaLote;

        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center mb-1";
        li.textContent = `Lote #${lote.id} - ${lote.tipoFibra} (${lote.kilogramos} kg): ${aguaLote} L`;

        lista.appendChild(li);
    });

    aguaTotalTexto.textContent = totalAcumulado;
}

function cargarLotes() {
    mostrarLotes();
}