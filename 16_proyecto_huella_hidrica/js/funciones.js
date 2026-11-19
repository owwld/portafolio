class Usuario {
    constructor(id, nombre, password) {
        this.id = id;
        this.nombre = nombre;
        this.password = password;
    }
}

// Elementos del DOM
const seccionLogin = document.getElementById("seccionLogin");
const seccionRegistro = document.getElementById("seccionRegistro");
const mensaje = document.getElementById("mensaje");

// Inputs Login
const inputUsuario = document.getElementById("usuario");
const inputPassword = document.getElementById("password");

// Inputs Registro
const inputNuevoUsuario = document.getElementById("nuevoUsuario");
const inputNuevaPassword = document.getElementById("nuevaPassword");

// Botones
const btnIngresar = document.getElementById("btnIngresar");
const btnIrRegistro = document.getElementById("btnIrRegistro");
const btnGuardar = document.getElementById("btnGuardar");
const btnVolverLogin = document.getElementById("btnVolverLogin");

// Eventos
btnIrRegistro.addEventListener("click", mostrarRegistro);
btnVolverLogin.addEventListener("click", mostrarLogin);
btnGuardar.addEventListener("click", registrarUsuario);
btnIngresar.addEventListener("click", iniciarSesion);

// Funciones para cambiar de vista
function mostrarRegistro() {
    seccionLogin.classList.add("d-none");
    seccionRegistro.classList.remove("d-none");
    mensaje.textContent = "";
}

function mostrarLogin() {
    seccionRegistro.classList.add("d-none");
    seccionLogin.classList.remove("d-none");
    mensaje.textContent = "";
}

// Obtener usuarios desde localStorage
function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
}

// Registrar nuevo usuario
function registrarUsuario() {
    const nombre = inputNuevoUsuario.value.trim();
    const password = inputNuevaPassword.value.trim();

    if (nombre === "" || password === "") {
        return alert("Por favor complete todos los campos");
    }

    const usuarios = obtenerUsuarios();

    // Validar que no exista el usuario
    const existe = usuarios.some(u => u.nombre === nombre);
    if (existe || nombre === "admin") {
        mensaje.className = "mt-3 fw-bold text-center text-danger";
        mensaje.textContent = "Ese usuario ya existe";
        return;
    }

    const nuevoUsuario = new Usuario(usuarios.length + 1, nombre, password);
    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    inputNuevoUsuario.value = "";
    inputNuevaPassword.value = "";
    
    mostrarLogin();
    mensaje.className = "mt-3 fw-bold text-center text-success";
    mensaje.textContent = "Usuario registrado correctamente";
}

// Validar inicio de sesión
function iniciarSesion() {
    const nombre = inputUsuario.value.trim();
    const password = inputPassword.value.trim();

    if (nombre === "" || password === "") {
        return alert("Por favor ingrese usuario y contraseña");
    }

    const usuarios = obtenerUsuarios();
    const usuarioValido = usuarios.find(u => u.nombre === nombre && u.password === password);

    if ((nombre === "admin" && password === "1234") || usuarioValido) {
        mensaje.className = "mt-3 fw-bold text-center text-success";
        mensaje.textContent = "¡Bienvenido, " + nombre + "!";
    } else {
        mensaje.className = "mt-3 fw-bold text-center text-danger";
        mensaje.textContent = "Usuario o contraseña incorrectos";
    }
}