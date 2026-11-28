/* =====================================================
   NELL - Administración de usuarios (admin/usuarios.html)
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var adminActual = iniciarLayout();
  if (!adminActual) return;

  var selectFiltro = document.getElementById("filtroRolAdmin");
  var tbody = document.getElementById("tablaUsuariosAdminBody");

  function eliminarUsuarioYCascada(usuarioId) {
    var pubsUsuario = NELL.tablas.publicaciones.filtrar(function (p) {
      return String(p.arrendadorId) === String(usuarioId);
    });
    var idsPubs = pubsUsuario.map(function (p) {
      return String(p.id);
    });

    // Eliminar publicaciones del usuario
    NELL.tablas.publicaciones.eliminarDonde(function (p) {
      return String(p.arrendadorId) === String(usuarioId);
    });

    // Eliminar reseñas escritas por el usuario o pertenecientes a sus publicaciones
    NELL.tablas.resenas.eliminarDonde(function (r) {
      return (
        String(r.autorId) === String(usuarioId) ||
        idsPubs.indexOf(String(r.publicacionId)) !== -1
      );
    });

    // Eliminar solicitudes asociadas
    NELL.tablas.solicitudes.eliminarDonde(function (s) {
      return (
        String(s.estudianteId) === String(usuarioId) ||
        String(s.arrendadorId) === String(usuarioId)
      );
    });

    // Eliminar mensajes de chat del usuario o en conversaciones donde participa
    NELL.tablas.mensajes.eliminarDonde(function (m) {
      var partes = (m.conversacionId || "").split("__");
      return (
        String(m.remitenteId) === String(usuarioId) ||
        partes.indexOf(String(usuarioId)) !== -1
      );
    });

    // Eliminar el usuario
    NELL.tablas.usuarios.eliminar(usuarioId);
  }

  function renderizar() {
    var todos = NELL.tablas.usuarios.todos();
    var pubs = NELL.tablas.publicaciones.todos();

    var numEst = todos.filter(function (u) {
      return u.rol === "estudiante";
    }).length;
    var numArr = todos.filter(function (u) {
      return u.rol === "arrendador";
    }).length;

    document.getElementById("indAdmTotalUsuarios").textContent = todos.length;
    document.getElementById("indAdmEstudiantes").textContent = numEst;
    document.getElementById("indAdmArrendadores").textContent = numArr;
    document.getElementById("indAdmPublicaciones").textContent = pubs.length;

    var filtro = selectFiltro.value;
    var filtrados = todos.filter(function (u) {
      if (filtro === "Estudiantes") return u.rol === "estudiante";
      if (filtro === "Arrendadores") return u.rol === "arrendador";
      if (filtro === "Administradores") return u.rol === "admin";
      return true;
    });

    var etiquetaRol = {
      estudiante: "Estudiante",
      arrendador: "Arrendador",
      admin: "Administrador"
    };

    tbody.innerHTML = filtrados
      .map(function (u) {
        var esElMismo = String(u.id) === String(adminActual.id);
        var btnEliminar = esElMismo
          ? ""
          : '<button type="button" class="btn btn-rojo btn-chico btn-eliminar-usr" data-id="' +
            NELL.escaparHTML(u.id) +
            '">Eliminar</button>';

        return (
          "<tr>" +
          "<td><strong>" +
          NELL.escaparHTML(NELL.nombreCompleto(u)) +
          "</strong></td>" +
          "<td>" +
          NELL.escaparHTML(u.correo) +
          "</td>" +
          "<td>" +
          NELL.escaparHTML(etiquetaRol[u.rol] || u.rol) +
          "</td>" +
          "<td>" +
          NELL.escaparHTML(u.miembroDesde || "-") +
          "</td>" +
          '<td><div class="grupo-botones" style="margin-top:0;">' +
          '<a href="editar-usuario.html?id=' +
          encodeURIComponent(u.id) +
          '" class="btn btn-chico">Editar</a>' +
          btnEliminar +
          "</div></td>" +
          "</tr>"
        );
      })
      .join("");
  }

  selectFiltro.addEventListener("change", renderizar);

  tbody.addEventListener("click", function (e) {
    var btn = e.target.closest(".btn-eliminar-usr");
    if (!btn) return;

    var idEliminar = btn.getAttribute("data-id");
    if (String(idEliminar) === String(adminActual.id)) return;

    var u = NELL.tablas.usuarios.buscar(idEliminar);
    if (!u) return;

    var confirmar = window.confirm(
      '¿Seguro que deseas eliminar al usuario "' +
        NELL.nombreCompleto(u) +
        '" junto con sus publicaciones, reseñas, solicitudes y mensajes?'
    );
    if (!confirmar) return;

    eliminarUsuarioYCascada(idEliminar);
    renderizar();
  });

  document
    .getElementById("btnRestablecerPrueba")
    .addEventListener("click", function () {
      var confirmar = window.confirm(
        "¿Restablecer todos los datos de prueba originales? Se perderán los cambios realizados."
      );
      if (!confirmar) return;

      NELL.cargarDatosDePrueba(true);
      NELL.iniciarSesion(adminActual.id);
      iniciarLayout();
      renderizar();
    });

  renderizar();
});