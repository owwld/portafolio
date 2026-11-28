/* =====================================================
   NELL - Mis publicaciones (arrendador/publicaciones.html)
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var usuario = iniciarLayout();
  if (!usuario) return;

  var grid = document.getElementById("gridMisPublicaciones");
  var contador = document.getElementById("contadorPublicadas");

  function renderizar() {
    var mias = NELL.tablas.publicaciones.filtrar(function (p) {
      return String(p.arrendadorId) === String(usuario.id);
    });

    var publicadas = mias.filter(function (p) {
      return p.estado === "Publicada";
    }).length;

    contador.textContent = publicadas + " viviendas publicadas";

    var tarjetasHTML = mias
      .map(function (pub) {
        var tieneFoto = pub.fotos && pub.fotos.length > 0;
        var portadaHTML = tieneFoto
          ? '<img src="' + NELL.escaparHTML(pub.fotos[0]) + '" alt="' + NELL.escaparHTML(pub.titulo) + '" />'
          : "";
        var estiloFondo = tieneFoto
          ? ""
          : ' style="background: ' + NELL.degradadoPorDefecto(pub.id) + ';"';
        var claseEst = NELL.claseEstado(pub.estado);

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
          '<p class="' +
          claseEst +
          '" style="font-size: 0.85rem;">' +
          NELL.escaparHTML(pub.estado) +
          "</p>" +
          '<div class="pie-vivienda grupo-botones">' +
          '<a href="editar-publicacion.html?id=' +
          encodeURIComponent(pub.id) +
          '" class="btn btn-chico">Editar</a>' +
          '<button type="button" class="btn btn-rojo btn-chico btn-eliminar-pub" data-id="' +
          NELL.escaparHTML(pub.id) +
          '">Eliminar</button>' +
          "</div>" +
          "</div>" +
          "</article>"
        );
      })
      .join("");

    var tarjetaAgregar =
      '<a href="nueva-publicacion.html" class="tarjeta-agregar">' +
      '<span class="mas-grande">+</span>' +
      "<strong>Agregar mas</strong>" +
      "</a>";

    grid.innerHTML = tarjetasHTML + tarjetaAgregar;
  }

  grid.addEventListener("click", function (e) {
    var btnEliminar = e.target.closest(".btn-eliminar-pub");
    if (!btnEliminar) return;

    var pubId = btnEliminar.getAttribute("data-id");
    var pub = NELL.tablas.publicaciones.buscar(pubId);
    if (!pub || String(pub.arrendadorId) !== String(usuario.id)) return;

    var confirmar = window.confirm(
      '¿Seguro que deseas eliminar "' + pub.titulo + '"? También se eliminarán sus reseñas.'
    );
    if (!confirmar) return;

    NELL.tablas.publicaciones.eliminar(pubId);
    NELL.tablas.resenas.eliminarDonde(function (r) {
      return String(r.publicacionId) === String(pubId);
    });
    renderizar();
  });

  renderizar();
});