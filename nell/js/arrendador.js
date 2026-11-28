/* =====================================================
   NELL - Registro de arrendador Paso 1 (registro/arrendador.html)
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var form = document.getElementById("formRegistroArr1");
  var errorBox = document.getElementById("errorRegistroArr1");

  // Si volvió del paso 2, precargar datos guardados
  var previo = localStorage.getItem(NELL.CLAVES.registroArrendadorTemp);
  if (previo) {
    try {
      var d = JSON.parse(previo);
      document.getElementById("arrNombre").value = d.nombre || "";
      document.getElementById("arrApellido").value = d.apellido || "";
      document.getElementById("arrCorreo").value = d.correo || "";
      document.getElementById("arrTelefono").value = d.telefono || "";
      document.getElementById("arrCiudad").value = d.ciudad || "León, Guanajuato";
      document.getElementById("arrGenero").value = d.genero || "Hombre";
    } catch (e) {}
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    errorBox.textContent = "";

    var nombre = document.getElementById("arrNombre").value.trim();
    var apellido = document.getElementById("arrApellido").value.trim();
    var correo = document.getElementById("arrCorreo").value.trim();
    var telefono = document.getElementById("arrTelefono").value.trim();
    var ciudad = document.getElementById("arrCiudad").value.trim();
    var genero = document.getElementById("arrGenero").value;
    var contrasena = document.getElementById("arrContrasena").value;
    var confirmar = document.getElementById("arrConfirmar").value;

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

    var temp = {
      nombre: nombre,
      apellido: apellido,
      correo: correo,
      telefono: telefono,
      ciudad: ciudad,
      genero: genero,
      contrasena: contrasena
    };

    localStorage.setItem(NELL.CLAVES.registroArrendadorTemp, JSON.stringify(temp));
    window.location.href = "arrendador-datos.html";
  });
});