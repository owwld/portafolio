/* =====================================================
   NELL - Explorador de viviendas (estudiante/inicio.html)
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var usuario = iniciarLayout();
  if (!usuario) return;

  var grid = document.getElementById("gridViviendas");
  var sinResultados = document.getElementById("sinResultados");
  var formFiltros = document.getElementById("formFiltros");

  function renderizarViviendas() {
    var textoUni = document.getElementById("filtroUniversidad").value.trim().toLowerCase();
    var precioMax = Number(document.getElementById("filtroPrecio").value) || 0;
    var tipo = document.getElementById("filtroTipo").value;
    var genero = document.getElementById("filtroGenero").value;

    var lista = NELL.tablas.publicaciones.filtrar(function (pub) {
      if (pub.estado !== "Publicada") return false;

      if (textoUni) {
        var uni = (pub.universidad || "").toLowerCase();
        var col = (pub.colonia || "").toLowerCase();
        if (uni.indexOf(textoUni) === -1 && col.indexOf(textoUni) === -1) {
          return false;
        }
      }

      if (precioMax > 0 && Number(pub.precio) > precioMax) {
        return false;
      }

      if (tipo !== "Todos" && pub.tipo !== tipo) {
        return false;
      }

      if (genero === "Solo mujeres") {
        var amenidades = pub.amenidades || [];
        var tieneSoloMujer = amenidades.some(function (a) {
          return a.toLowerCase() === "solo mujer";
        });
        if (!tieneSoloMujer) return false;
      }

      return true;
    });

    if (lista.length === 0) {
      grid.innerHTML = "";
      sinResultados.hidden = false;
      return;
    }

    sinResultados.hidden = true;
    grid.innerHTML = lista
      .map(function (pub) {
        var tieneFoto = pub.fotos && pub.fotos.length > 0;
        var portadaHTML = tieneFoto
          ? '<img src="' + NELL.escaparHTML(pub.fotos[0]) + '" alt="' + NELL.escaparHTML(pub.titulo) + '" />'
          : "";
        var estiloFondo = tieneFoto ? "" : ' style="background: ' + NELL.degradadoPorDefecto(pub.id) + ';"';

        var chipsHTML = (pub.amenidades || [])
          .map(function (am) {
            return '<span class="chip">' + NELL.escaparHTML(am) + "</span>";
          })
          .join("");

        return (
          '<article class="tarjeta-vivienda">' +
          '<div class="portada-vivienda"' +
          estiloFondo +
          ">" +
          portadaHTML +
          '<span class="etiqueta-precio">' +
          NELL.formatoDinero(pub.precio) +
          "/mes</span>" +
          "</div>" +
          '<div class="cuerpo-vivienda">' +
          "<h3>" +
          NELL.escaparHTML(pub.titulo) +
          "</h3>" +
          '<p class="ubicacion-vivienda">📍 ' +
          NELL.escaparHTML(pub.colonia) +
          "</p>" +
          '<div class="lista-chips">' +
          chipsHTML +
          "</div>" +
          '<div class="pie-vivienda">' +
          '<a href="detalle.html?id=' +
          encodeURIComponent(pub.id) +
          '" class="btn btn-verde btn-bloque">Ver más detalles</a>' +
          "</div>" +
          "</div>" +
          "</article>"
        );
      })
      .join("");
  }

  formFiltros.addEventListener("submit", function (e) {
    e.preventDefault();
    renderizarViviendas();
  });

  renderizarViviendas();
});