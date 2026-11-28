/* =====================================================
   NELL - Historial de contratos (arrendador/contratos.html)
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var usuario = iniciarLayout();
  if (!usuario) return;

  var contratos = NELL.tablas.contratos.filtrar(function (c) {
    return String(c.arrendadorId) === String(usuario.id);
  });

  var activosLista = contratos.filter(function (c) {
    return c.estado === "Activo";
  });

  var finalizados = contratos.filter(function (c) {
    return (c.estado || "").indexOf("Finalizado") === 0;
  }).length;

  var ingresosActivos = activosLista.reduce(function (acum, c) {
    return acum + (Number(c.renta) || 0);
  }, 0);

  document.getElementById("subtituloContratosArr").textContent =
    contratos.length + " Contactos Registrados";
  document.getElementById("indArrTotal").textContent = contratos.length;
  document.getElementById("indArrActivos").textContent = activosLista.length;
  document.getElementById("indArrFinalizados").textContent = finalizados;
  document.getElementById("indArrIngresos").textContent =
    NELL.formatoDinero(ingresosActivos);

  var tbody = document.getElementById("tablaContratosArrBody");
  if (contratos.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" class="subtitulo-pantalla" style="text-align:center;">Aún no tienes contratos registrados.</td></tr>';
    return;
  }

  tbody.innerHTML = contratos
    .map(function (c) {
      var claseEst = NELL.claseEstado(c.estado);
      var conChat = c.estudianteId || c.estudianteNombre;
      var btnContrato =
        c.estado !== "Rechazado"
          ? '<a href="contrato.html?id=' +
            encodeURIComponent(c.id) +
            '" class="btn btn-chico">Ver contrato</a>'
          : "";

      return (
        "<tr>" +
        "<td><strong>" +
        NELL.escaparHTML(c.viviendaTitulo) +
        "</strong><br /><span class='subtitulo-pantalla'>" +
        NELL.escaparHTML(c.colonia) +
        "</span></td>" +
        "<td>" +
        NELL.escaparHTML(c.estudianteNombre) +
        "</td>" +
        "<td>" +
        NELL.formatearFecha(c.fechaInicio) +
        "</td>" +
        "<td>" +
        NELL.formatearFecha(c.fechaFin) +
        "</td>" +
        '<td class="' +
        claseEst +
        '">' +
        NELL.escaparHTML(c.estado) +
        "</td>" +
        '<td><div class="grupo-botones" style="margin-top:0;">' +
        '<a href="chat.html?con=' +
        encodeURIComponent(conChat) +
        '" class="btn btn-verde btn-chico">Ir al chat</a>' +
        btnContrato +
        "</div></td>" +
        "</tr>"
      );
    })
    .join("");
});