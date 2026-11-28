/* =====================================================
   NELL - Registro de estudiante (registro/estudiante.html)
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var form = document.getElementById("formRegistroEstudiante");
  var errorBox = document.getElementById("errorRegistroEst");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    errorBox.textContent = "";

    var nombre = document.getElementById("estNombre").value.trim();
    var apellido = document.getElementById("estApellido").value.trim();
    var correo = document.getElementById("estCorreo").value.trim();
    var telefono = document.getElementById("estTelefono").value.trim();
    var ciudad = document.getElementById("estCiudad").value.trim();
    var universidad = document.getElementById("estUniversidad").value.trim();
    var contrasena = document.getElementById("estContrasena").value;
    var confirmar = document.getElementById("estConfirmar").value;

    if (contrasena.length < 4) {
      errorBox.textContent = "La contraseña debe tener al menos 4 caracteres.";
      return;
    }

    if (contrasena !== confirmar) {
      errorBox.textContent = "Las contraseñas no coinciden.";
      return;
    }

    var repetido = NELL.tablas.usuarios.filtrar(function (u) {
      return (u.correo || "").toLowerCase() === correo.toLowerCase();
    });

    if (repetido.length > 0) {
      errorBox.textContent = "Ese correo electrónico ya está registrado.";
      return;
    }

    var meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    var ahora = new Date();
    var miembroDesde = meses[ahora.getMonth()] + " " + ahora.getFullYear();

    var nuevo = NELL.tablas.usuarios.agregar({
      rol: "estudiante",
      nombre: nombre,
      apellido: apellido,
      correo: correo,
      telefono: telefono,
      ciudad: ciudad,
      universidad: universidad,
      miembroDesde: miembroDesde,
      contrasena: contrasena,
      notificaciones: { solicitudes: true, mensajes: true, recomendaciones: false }
    });

    NELL.iniciarSesion(nuevo.id);
    window.location.href = "../estudiante/inicio.html";
  });
});