/* =====================================================
   NELL - Solicitudes recibidas (arrendador/solicitudes.html)
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var usuario = iniciarLayout();
  if (!usuario) return;

  var colViviendas = document.getElementById("columnaSolicitudesVivienda");
  var listaContratos = document.getElementById("listaContratosAprobados");

  function renderizar() {
    var solicitudes = NELL.tablas.solicitudes.filtrar(function (s) {
      return String(s.arrendadorId) === String(usuario.id);
    });

    if (solicitudes.length === 0) {
      colViviendas.innerHTML =
        '<div class="panel"><p class="subtitulo-pantalla">Aún no has recibido solicitudes de renta.</p></div>';
    } else {
      // Agrupar solicitudes por vivienda
      var grupos = {};
      var ordenViviendas = [];

      solicitudes.forEach(function (sol) {
        var clave = sol.publicacionId || sol.viviendaTitulo;
        if (!grupos[clave]) {
          grupos[clave] = {
            titulo: sol.viviendaTitulo,
            items: []
          };
          ordenViviendas.push(clave);
        }
        grupos[clave].items.push(sol);
      });

      colViviendas.innerHTML = ordenViviendas
        .map(function (clave) {
          var grupo = grupos[clave];
          var filasHTML = grupo.items
            .map(function (s) {
              var accionesHTML = "";

              if (s.estado === "Pendiente") {
                accionesHTML =
                  '<a href="info-contacto.html?id=' +
                  encodeURIComponent(s.id) +
                  '" class="btn btn-chico">Ver informacion</a>' +
                  '<button type="button" class="btn btn-verde btn-chico btn-aceptar-sol" data-id="' +
                  NELL.escaparHTML(s.id) +
                  '">Aceptar</button>' +
                  '<button type="button" class="btn btn-rojo btn-chico btn-rechazar-sol" data-id="' +
                  NELL.escaparHTML(s.id) +
                  '">Rechazar</button>';
              } else if (s.estado === "Aprobada") {
                accionesHTML =
                  '<a href="info-contacto.html?id=' +
                  encodeURIComponent(s.id) +
                  '" class="btn btn-chico">Ver informacion</a>' +
                  '<span class="estado-verde" style="font-size:0.85rem;">Aprobada</span>' +
                  '<a href="contrato.html?id=' +
                  encodeURIComponent(s.contratoId) +
                  '" class="btn btn-verde btn-chico">contrato</a>';
              } else {
                accionesHTML =
                  '<span class="estado-rojo" style="font-size:0.85rem;">Rechazada</span>';
              }

              return (
                '<div class="item-solicitud">' +
                "<strong>" +
                NELL.escaparHTML(s.estudianteNombre) +
                "</strong>" +
                '<div class="grupo-botones" style="margin-top:0; align-items:center;">' +
                accionesHTML +
                "</div>" +
                "</div>"
              );
            })
            .join("");

          return (
            '<section class="panel">' +
            "<h2>" +
            NELL.escaparHTML(grupo.titulo) +
            "</h2>" +
            filasHTML +
            "</section>"
          );
        })
        .join("");
    }

    // Panel derecho: solicitantes aprobados con enlace a su contrato
    var aprobadas = solicitudes.filter(function (s) {
      return s.estado === "Aprobada" && s.contratoId;
    });

    if (aprobadas.length === 0) {
      listaContratos.innerHTML =
        '<p class="subtitulo-pantalla">No hay solicitudes aprobadas todavía.</p>';
    } else {
      listaContratos.innerHTML = aprobadas
        .map(function (s) {
          return (
            '<div class="item-solicitud">' +
            "<div><strong>" +
            NELL.escaparHTML(s.estudianteNombre) +
            "</strong><br /><span class='subtitulo-pantalla' style='font-size:0.8rem;'>" +
            NELL.escaparHTML(s.viviendaTitulo) +
            "</span></div>" +
            '<a href="contrato.html?id=' +
            encodeURIComponent(s.contratoId) +
            '" class="btn btn-verde btn-chico">Ver informacion</a>' +
            "</div>"
          );
        })
        .join("");
    }
  }

  colViviendas.addEventListener("click", function (e) {
    var btnAceptar = e.target.closest(".btn-aceptar-sol");
    if (btnAceptar) {
      var solId = btnAceptar.getAttribute("data-id");
      var sol = NELL.tablas.solicitudes.buscar(solId);
      if (!sol || sol.estado !== "Pendiente") return;

      var fechaInicio = sol.fechaInicio || NELL.fechaHoyISO();
      var duracion = Number(sol.duracion) || 12;
      var fechaFin = NELL.sumarMeses(fechaInicio, duracion);

      var nuevoContrato = NELL.tablas.contratos.agregar({
        publicacionId: sol.publicacionId,
        viviendaTitulo: sol.viviendaTitulo,
        colonia: sol.colonia,
        estudianteId: sol.estudianteId,
        estudianteNombre: sol.estudianteNombre,
        estudianteCiudad: sol.estudianteCiudad || "León, Guanajuato",
        estudianteTelefono: sol.estudianteTelefono || "477 000 0000",
        arrendadorId: usuario.id,
        arrendadorNombre: NELL.nombreCorto(usuario),
        arrendadorCiudad: usuario.ciudad || "León, Guanajuato",
        arrendadorTelefono: usuario.telefono || "477 000 0000",
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
        duracion: duracion,
        renta: Number(sol.renta) || 0,
        deposito: Number(sol.deposito) || 0,
        estado: "Activo",
        archivoContrato: ""
      });

      NELL.tablas.solicitudes.actualizar(sol.id, {
        estado: "Aprobada",
        contratoId: nuevoContrato.id
      });

      renderizar();
      return;
    }

    var btnRechazar = e.target.closest(".btn-rechazar-sol");
    if (btnRechazar) {
      var solIdRech = btnRechazar.getAttribute("data-id");
      var solRech = NELL.tablas.solicitudes.buscar(solIdRech);
      if (!solRech || solRech.estado !== "Pendiente") return;

      NELL.tablas.solicitudes.actualizar(solRech.id, {
        estado: "Rechazada"
      });

      renderizar();
    }
  });

  renderizar();
});