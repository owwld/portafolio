// Referencias a elementos del DOM
const titulo = document.getElementById("titulo");
const formLogin = document.getElementById("formLogin");
const formRegistro = document.getElementById("formRegistro");
const mensaje = document.getElementById("mensaje");

const btnIrRegistro = document.getElementById("btnIrRegistro");
const btnVolverLogin = document.getElementById("btnVolverLogin");

// 1. Alternar al formulario de Registro
btnIrRegistro.addEventListener("click", () => {
  formLogin.style.display = "none";
  formRegistro.style.display = "block";
  titulo.textContent = "Registro de Usuario";
  mensaje.textContent = "";
});

// 2. Alternar de vuelta al formulario de Login
btnVolverLogin.addEventListener("click", () => {
  formRegistro.style.display = "none";
  formLogin.style.display = "block";
  titulo.textContent = "Inicio de Sesión";
  mensaje.textContent = "";
});

// 3. Lógica para registrar un nuevo usuario en localStorage
formRegistro.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const nuevoUsuario = document.getElementById("nuevoUsuario").value.trim();
  const nuevaPassword = document.getElementById("nuevaPassword").value.trim();

  // Obtener la lista actual de usuarios o crear un arreglo vacío si no existe
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  // Validar que el usuario no exista previamente
  const usuarioExiste = usuarios.some(u => u.usuario === nuevoUsuario) || nuevoUsuario === "admin";

  if (usuarioExiste) {
    mensaje.style.color = "red";
    mensaje.textContent = "El nombre de usuario ya está registrado.";
    return;
  }

  // Guardar el nuevo usuario en el arreglo y actualizar localStorage
  usuarios.push({ usuario: nuevoUsuario, password: nuevaPassword });
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  mensaje.style.color = "green";
  mensaje.textContent = "¡Usuario registrado con éxito! Ahora puedes iniciar sesión.";
  formRegistro.reset();

  // Regresar automáticamente al login después de 1.5 segundos
  setTimeout(() => {
    formRegistro.style.display = "none";
    formLogin.style.display = "block";
    titulo.textContent = "Inicio de Sesión";
    mensaje.textContent = "";
  }, 1500);
});

// 4. Lógica para validar el Inicio de Sesión
formLogin.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const usuario = document.getElementById("usuario").value.trim();
  const password = document.getElementById("password").value.trim();

  // Recuperar usuarios guardados en localStorage
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  // Buscar coincidencia en localStorage o permitir el usuario por defecto ("admin")
  const usuarioValido = usuarios.find(u => u.usuario === usuario && u.password === password);

  if ((usuario === "admin" && password === "1234") || usuarioValido) {
    mensaje.style.color = "green";
    mensaje.textContent = "¡Bienvenido, " + usuario + "!";
  } else {
    mensaje.style.color = "red";
    mensaje.textContent = "Usuario o contraseña incorrectos";
  }
});