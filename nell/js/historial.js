/* =====================================================
   NELL - Historial del estudiante (estudiante/historial.html)
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var usuario = iniciarLayout();
  if (!usuario) return;

  var contratos = NELL.tablas.contratos.filtrar(function (c) {
    return String(c.estudianteId) === String(usuario.id);
  });

  // Solicitudes del estudiante que aún no tienen contrato asociado
  var solicitudesSinContrato = NELL.tablas.solicitudes.filtrar(function (s) {
    return String(s.estudianteId) === String(usuario.id) && !s.contratoId;
  });

  var activos = contratos.filter(function (c) {
    return c.estado === "Activo";
  }).length;

  var finalizados = contratos.filter(function (c) {
    return (c.estado || "").indexOf("Finalizado") === 0;
  }).length;

  var totalRegistros = contratos.length + solicitudesSinContrato.length;

  document.getElementById("subtituloHistorial").textContent =
    totalRegistros + " Contactos Registrados";
  document.getElementById("indTotalContratos").textContent = contratos.length;
  document.getElementById("indActivosContratos").textContent = activos;
  document.getElementById("indFinalizadosContratos").textContent = finalizados;

  var filas = [];

  contratos.forEach(function (c) {
    var estadoMostrar = c.estado === "Activo" ? "Aprobado" : c.estado;
    var claseEst = NELL.claseEstado(estadoMostrar);
    var conChat = c.arrendadorId || c.arrendadorNombre;

    var btnContrato =
      c.estado !== "Rechazado"
        ? '<a href="contrato.html?id=' +
          encodeURIComponent(c.id) +
          '" class="btn btn-chico">Ver contrato</a>'
        : "";

    filas.push(
      "<tr>" +
        "<td><strong>" +
        NELL.escaparHTML(c.viviendaTitulo) +
        "</strong><br /><span class='subtitulo-pantalla'>" +
        NELL.escaparHTML(c.colonia) +
        "</span></td>" +
        "<td>" +
        NELL.escaparHTML(c.arrendadorNombre) +
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
        NELL.escaparHTML(estadoMostrar) +
        "</td>" +
        '<td><div class="grupo-botones" style="margin-top:0;">' +
        '<a href="chat.html?con=' +
        encodeURIComponent(conChat) +
        '" class="btn btn-verde btn-chico">Ir al chat</a>' +
        btnContrato +
        "</div></td>" +
        "</tr>"
    );
  });

  solicitudesSinContrato.forEach(function (s) {
    var estadoSol = s.estado === "Rechazada" ? "Rechazado" : s.estado;
    var claseEst = NELL.claseEstado(estadoSol);
    var fechaFinEst = NELL.sumarMeses(s.fechaInicio, s.duracion);
    var conChat = s.arrendadorId || s.arrendadorNombre;

    filas.push(
      "<tr>" +
        "<td><strong>" +
        NELL.escaparHTML(s.viviendaTitulo) +
        "</strong><br /><span class='subtitulo-pantalla'>" +
        NELL.escaparHTML(s.colonia) +
        "</span></td>" +
        "<td>" +
        NELL.escaparHTML(s.arrendadorNombre) +
        "</td>" +
        "<td>" +
        NELL.formatearFecha(s.fechaInicio) +
        "</td>" +
        "<td>" +
        NELL.formatearFecha(fechaFinEst) +
        "</td>" +
        '<td class="' +
        claseEst +
        '">' +
        NELL.escaparHTML(estadoSol) +
        "</td>" +
        '<td><div class="grupo-botones" style="margin-top:0;">' +
        '<a href="chat.html?con=' +
        encodeURIComponent(conChat) +
        '" class="btn btn-verde btn-chico">Ir al chat</a>' +
        "</div></td>" +
        "</tr>"
    );
  });

  var tbody = document.getElementById("tablaHistorialBody");
  if (filas.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="6" class="subtitulo-pantalla" style="text-align:center;">Aún no tienes solicitudes ni contratos registrados.</td></tr>';
  } else {
    tbody.innerHTML = filas.join("");
  }
});