/* =====================================================
   NELL - Información de contacto (arrendador/info-contacto.html)
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var usuario = iniciarLayout();
  if (!usuario) return;

  var id = NELL.obtenerParametro("id");
  if (!id) {
    window.location.href = "solicitudes.html";
    return;
  }

  var solicitud = NELL.tablas.solicitudes.buscar(id);
  var estudianteId = solicitud ? solicitud.estudianteId : id;
  var cuentaEst = NELL.tablas.usuarios.buscar(estudianteId);

  if (!solicitud && !cuentaEst) {
    window.location.href = "solicitudes.html";
    return;
  }

  var nombre = cuentaEst
    ? NELL.nombreCorto(cuentaEst)
    : solicitud.estudianteNombre;
  var correo = cuentaEst
    ? cuentaEst.correo
    : solicitud.estudianteCorreo || "sin-correo@mail.com";
  var telefono = cuentaEst
    ? cuentaEst.telefono
    : solicitud.estudianteTelefono || "477 000 0000";
  var ciudad = cuentaEst
    ? cuentaEst.ciudad
    : solicitud.estudianteCiudad || "León, Guanajuato";
  var universidad = cuentaEst
    ? cuentaEst.universidad
    : solicitud.estudianteUniversidad || "UTL";
  var miembroDesde = cuentaEst
    ? cuentaEst.miembroDesde
    : solicitud.estudianteMiembroDesde || "Enero 2022";

  var solicitudesPrevias = NELL.tablas.solicitudes.filtrar(function (s) {
    return (
      String(s.estudianteId) === String(estudianteId) ||
      (s.estudianteNombre || "").toLowerCase() === nombre.toLowerCase()
    );
  }).length;

  var contratosEstudiante = NELL.tablas.contratos.filtrar(function (c) {
    return (
      String(c.estudianteId) === String(estudianteId) ||
      (c.estudianteNombre || "").toLowerCase() === nombre.toLowerCase()
    );
  });

  // Solo contratos con estado exactamente "Finalizado"
  var contratosFinalizados = contratosEstudiante.filter(function (c) {
    return c.estado === "Finalizado";
  }).length;

  document.getElementById("contactoIniciales").textContent = NELL.obtenerIniciales(nombre);
  document.getElementById("contactoNombre").textContent = nombre;
  document.getElementById("contactoCiudadLateral").textContent = ciudad;
  document.getElementById("contactoMiembro").textContent = "Miembro desde " + miembroDesde;
  document.getElementById("contactoSolicitudesPrevias").textContent =
    solicitudesPrevias + " Solicitudes previas";
  document.getElementById("contactoContratosFin").textContent =
    contratosFinalizados + " contratos finalizados";

  document.getElementById("btnChatContacto").href =
    "chat.html?con=" + encodeURIComponent(estudianteId || nombre);

  document.getElementById("contactoCorreo").textContent = correo;
  document.getElementById("contactoTelefono").textContent = telefono;
  document.getElementById("contactoCiudad").textContent = ciudad;
  document.getElementById("contactoUniversidad").textContent = universidad;

  var contHistorial = document.getElementById("historialPlataformaContacto");
  if (contratosEstudiante.length === 0) {
    contHistorial.innerHTML =
      '<p class="subtitulo-pantalla">Sin contratos registrados en la plataforma.</p>';
  } else {
    contHistorial.innerHTML = contratosEstudiante
      .map(function (c) {
        return (
          '<div class="item-solicitud">' +
          "<span>" +
          NELL.escaparHTML(c.viviendaTitulo) +
          "</span>" +
          '<span class="' +
          NELL.claseEstado(c.estado) +
          '">' +
          NELL.escaparHTML(c.estado) +
          "</span>" +
          "</div>"
        );
      })
      .join("");
  }
});