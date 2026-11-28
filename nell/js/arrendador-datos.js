/* =====================================================
   NELL - Registro de arrendador Paso 2 (arrendador-datos.html)
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var rawTemp = localStorage.getItem(NELL.CLAVES.registroArrendadorTemp);
  if (!rawTemp) {
    window.location.href = "arrendador.html";
    return;
  }

  var datosPaso1 = null;
  try {
    datosPaso1 = JSON.parse(rawTemp);
  } catch (e) {
    window.location.href = "arrendador.html";
    return;
  }

  if (!datosPaso1 || !datosPaso1.correo) {
    window.location.href = "arrendador.html";
    return;
  }

  var fotoDataUrl = "";
  var zonaFoto = document.getElementById("zonaFotoArr");
  var inputFoto = document.getElementById("inputFotoArr");
  var preview = document.getElementById("previewFotoArr");

  zonaFoto.addEventListener("click", function () {
    inputFoto.click();
  });

  inputFoto.addEventListener("change", function () {
    if (inputFoto.files && inputFoto.files[0]) {
      NELL.reducirImagenCanvas(inputFoto.files[0], function (dataUrl) {
        fotoDataUrl = dataUrl;
        preview.src = dataUrl;
        preview.hidden = false;
      });
    }
  });

  var form = document.getElementById("formRegistroArr2");
  var errorBox = document.getElementById("errorRegistroArr2");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    errorBox.textContent = "";

    var rfc = document.getElementById("arrRfc").value.trim().toUpperCase();
    var cuenta = document.getElementById("arrCuenta").value.trim();

    var meses = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    var ahora = new Date();
    var miembroDesde = meses[ahora.getMonth()] + " " + ahora.getFullYear();

    var nuevo = NELL.tablas.usuarios.agregar({
      rol: "arrendador",
      nombre: datosPaso1.nombre,
      apellido: datosPaso1.apellido,
      correo: datosPaso1.correo,
      telefono: datosPaso1.telefono,
      ciudad: datosPaso1.ciudad,
      genero: datosPaso1.genero,
      rfc: rfc,
      cuentaBancaria: cuenta,
      foto: fotoDataUrl,
      miembroDesde: miembroDesde,
      contrasena: datosPaso1.contrasena,
      notificaciones: { solicitudes: true, mensajes: true, recomendaciones: false }
    });

    localStorage.removeItem(NELL.CLAVES.registroArrendadorTemp);
    NELL.iniciarSesion(nuevo.id);
    window.location.href = "../arrendador/publicaciones.html";
  });
});