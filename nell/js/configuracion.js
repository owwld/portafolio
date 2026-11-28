/* =====================================================
   NELL - Configuración (estudiante / arrendador)
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var usuario = iniciarLayout();
  if (!usuario) return;

  document.getElementById("btnVolverConfig").addEventListener("click", function () {
    window.location.href = "perfil.html";
  });

  // Textos adaptados por rol
  var descSol = document.getElementById("descSwSolicitudes");
  var descRec = document.getElementById("descSwRecomendaciones");

  if (usuario.rol === "arrendador") {
    descSol.textContent = "Avisos sobre tus solicitudes de contrato";
    descRec.textContent = "Reseñas nuevas que dejan los usuarios";
  } else {
    descSol.textContent = "Avisos sobre el estado de tus solicitudes";
    descRec.textContent = "Viviendas nuevas que podrian interesarte";
  }

  var notif = usuario.notificaciones || {
    solicitudes: true,
    mensajes: true,
    recomendaciones: false
  };

  var swSolicitudes = document.getElementById("swSolicitudes");
  var swMensajes = document.getElementById("swMensajes");
  var swRecomendaciones = document.getElementById("swRecomendaciones");

  swSolicitudes.checked = Boolean(notif.solicitudes);
  swMensajes.checked = Boolean(notif.mensajes);
  swRecomendaciones.checked = Boolean(notif.recomendaciones);

  var formNotif = document.getElementById("formNotificaciones");
  var msgConfig = document.getElementById("msgConfig");

  formNotif.addEventListener("submit", function (e) {
    e.preventDefault();
    usuario = NELL.tablas.usuarios.actualizar(usuario.id, {
      notificaciones: {
        solicitudes: swSolicitudes.checked,
        mensajes: swMensajes.checked,
        recomendaciones: swRecomendaciones.checked
      }
    });
    msgConfig.textContent = "Preferencias de notificación guardadas.";
  });

  // Reportar un problema
  var btnReportar = document.getElementById("btnReportarProblema");
  var msgReporte = document.getElementById("msgReporte");

  btnReportar.addEventListener("click", function () {
    var descripcion = window.prompt("Describe brevemente el problema que encontraste:");
    if (!descripcion || !descripcion.trim()) return;

    NELL.tablas.reportes.agregar({
      usuarioId: usuario.id,
      usuarioNombre: NELL.nombreCorto(usuario),
      rol: usuario.rol,
      mensaje: descripcion.trim(),
      fecha: NELL.fechaHoyISO()
    });

    msgReporte.textContent = "Reporte enviado. Nuestro equipo lo revisará pronto.";
  });
});