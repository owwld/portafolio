/* =====================================================
   NELL - Crear reseña (estudiante/crear-resena.html)
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var usuario = iniciarLayout();
  if (!usuario) return;

  var id = NELL.obtenerParametro("id");
  var pub = id ? NELL.tablas.publicaciones.buscar(id) : null;

  if (!pub) {
    window.location.href = "inicio.html";
    return;
  }

  var urlResenas = "resenas.html?id=" + encodeURIComponent(pub.id);
  document.getElementById("btnVolverCrearResena").href = urlResenas;
  document.getElementById("btnCancelarResena").href = urlResenas;

  var coloniaSinPrefijo = (pub.colonia || "").replace(/^Col\.?\s*/i, "");
  document.getElementById("subtituloCrearResena").textContent =
    pub.titulo + " - " + coloniaSinPrefijo;

  var estrellasElegidas = 0;
  var contenedorEstrellas = document.getElementById("selectorEstrellas");
  var spansEstrellas = contenedorEstrellas.querySelectorAll("span");

  function pintarEstrellas(n) {
    for (var i = 0; i < spansEstrellas.length; i++) {
      var val = Number(spansEstrellas[i].getAttribute("data-valor"));
      if (val <= n) {
        spansEstrellas[i].textContent = "★";
        spansEstrellas[i].className = "estrella-llena";
      } else {
        spansEstrellas[i].textContent = "☆";
        spansEstrellas[i].className = "estrella-vacia";
      }
    }
  }

  contenedorEstrellas.addEventListener("click", function (e) {
    var val = Number(e.target.getAttribute("data-valor"));
    if (!val) return;
    estrellasElegidas = val;
    pintarEstrellas(estrellasElegidas);
  });

  var form = document.getElementById("formCrearResena");
  var errorBox = document.getElementById("errorCrearResena");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    errorBox.textContent = "";

    var mensaje = document.getElementById("mensajeResena").value.trim();
    if (!mensaje) {
      errorBox.textContent = "Escribe un mensaje para tu reseña.";
      return;
    }

    if (estrellasElegidas < 1 || estrellasElegidas > 5) {
      errorBox.textContent = "Selecciona una calificación de 1 a 5 estrellas.";
      return;
    }

    NELL.tablas.resenas.agregar({
      publicacionId: pub.id,
      autorId: usuario.id,
      autorNombre: NELL.nombreCorto(usuario),
      estrellas: estrellasElegidas,
      mensaje: mensaje,
      fecha: NELL.fechaHoyISO()
    });

    window.location.href = urlResenas;
  });
});