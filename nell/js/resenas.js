/* =====================================================
   NELL - Reseñas de vivienda (estudiante/resenas.html)
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

  document.getElementById("btnVolverResenas").href =
    "detalle.html?id=" + encodeURIComponent(pub.id);
  document.getElementById("btnCrearResena").href =
    "crear-resena.html?id=" + encodeURIComponent(pub.id);

  var selectOrden = document.getElementById("filtroOrdenResenas");
  var contenedor = document.getElementById("listaResenas");

  function dibujarEstrellas(cantidad) {
    var html = "";
    for (var i = 1; i <= 5; i++) {
      if (i <= cantidad) {
        html += '<span class="estrella-llena">★</span>';
      } else {
        html += '<span class="estrella-vacia">☆</span>';
      }
    }
    return '<div class="estrellas">' + html + "</div>";
  }

  function renderizar() {
    var orden = selectOrden.value;
    var lista = NELL.tablas.resenas.filtrar(function (r) {
      return String(r.publicacionId) === String(pub.id);
    });

    if (orden === "mayor") {
      lista.sort(function (a, b) {
        return Number(b.estrellas) - Number(a.estrellas);
      });
    } else if (orden === "menor") {
      lista.sort(function (a, b) {
        return Number(a.estrellas) - Number(b.estrellas);
      });
    } else {
      lista.reverse();
    }

    if (lista.length === 0) {
      contenedor.innerHTML =
        '<div class="panel" style="text-align:center;">' +
        "<p class='subtitulo-pantalla'>Esta vivienda aún no tiene reseñas. ¡Sé el primero en compartir tu experiencia!</p>" +
        "</div>";
      return;
    }

    contenedor.innerHTML = lista
      .map(function (r) {
        return (
          '<article class="tarjeta-resena">' +
          "<strong>" +
          NELL.escaparHTML(r.autorNombre) +
          "</strong>" +
          '<div class="cuadro-mensaje-resena">' +
          NELL.escaparHTML(r.mensaje) +
          "</div>" +
          '<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">' +
          '<span class="subtitulo-pantalla">' +
          NELL.escaparHTML(pub.titulo + " - " + pub.colonia) +
          "</span>" +
          dibujarEstrellas(Number(r.estrellas)) +
          "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  selectOrden.addEventListener("change", renderizar);
  renderizar();
});