const input = document.getElementById("tareaInput");
const btn = document.getElementById("agregarBtn");
const lista = document.getElementById("listaTareas");
 
//Cargar tareas al iniciar
 
document.addEventListener("DOMContentLoaded", () => {});
 
//Agregar nuevas tareas
btn.addEventListener("click", agregarTarea);
 
//funcion para agregar tarea
function agregarTarea() {
    const tarea = input.value.trim();
    if(tarea === "")
        return alert("Por favor ingrese una tarea");
   
    const tareas = obtenerTareas();
    tareas.push(tarea);
    localStorage.setItem("tareas", JSON.stringify(tareas));
    mostrarTareas();
    input.value = "";
}
 
function obtenerTareas() {
    return JSON.parse(localStorage.getItem("tareas")) || [];
}
 
function mostrarTareas() {
    const tareas = obtenerTareas();
    lista.innerHTML = "";
    tareas.forEach((tarea, index) => {
        const li = document.createElement("li");
        li.textContent = tarea;
 
        const btnEliminar = document.createElement("button");
        btnEliminar.textContent = "XX";
 
        lista.appendChild(li);
    })
}
 
function cargarTareas() {
    mostrarTareas();
}