/* =====================================================
   NELL - Lógica de inicio de sesión (index.html)
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  function redirigirPorRol(rol) {
    if (rol === "estudiante") {
      window.location.href = "estudiante/inicio.html";
    } else if (rol === "arrendador") {
      window.location.href = "arrendador/publicaciones.html";
    } else if (rol === "admin") {
      window.location.href = "admin/usuarios.html";
    }
  }

  // Si ya existe una sesión activa, redirigir directamente
  var sesionActual = NELL.obtenerSesion();
  if (sesionActual) {
    redirigirPorRol(sesionActual.rol);
    return;
  }

  var formLogin = document.getElementById("formLogin");
  var errorLogin = document.getElementById("errorLogin");

  formLogin.addEventListener("submit", function (e) {
    e.preventDefault();
    errorLogin.textContent = "";

    var correo = document.getElementById("correoLogin").value.trim().toLowerCase();
    var contrasena = document.getElementById("contrasenaLogin").value;

    var encontrados = NELL.tablas.usuarios.filtrar(function (u) {
      return (u.correo || "").toLowerCase() === correo && u.contrasena === contrasena;
    });

    if (encontrados.length === 0) {
      errorLogin.textContent = "Correo o contraseña incorrectos.";
      return;
    }

    var usuario = encontrados[0];
    NELL.iniciarSesion(usuario.id);
    redirigirPorRol(usuario.rol);
  });
});