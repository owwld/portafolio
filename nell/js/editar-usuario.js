/* =====================================================
   NELL - Editar usuario (admin/editar-usuario.html)
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var adminActual = iniciarLayout();
  if (!adminActual) return;

  var id = NELL.obtenerParametro("id");
  var usuarioEdit = id ? NELL.tablas.usuarios.buscar(id) : null;

  if (!usuarioEdit) {
    window.location.href = "usuarios.html";
    return;
  }

  document.getElementById("admUsrNombre").value = usuarioEdit.nombre || "";
  document.getElementById("admUsrApellido").value = usuarioEdit.apellido || "";
  document.getElementById("admUsrCorreo").value = usuarioEdit.correo || "";
  document.getElementById("admUsrTelefono").value = usuarioEdit.telefono || "";
  document.getElementById("admUsrCiudad").value = usuarioEdit.ciudad || "";

  var bloqueUni = document.getElementById("campoAdminUniversidad");
  var bloqueArr = document.getElementById("camposAdminArrendador");

  if (usuarioEdit.rol === "estudiante") {
    bloqueUni.hidden = false;
    document.getElementById("admUsrUniversidad").value = usuarioEdit.universidad || "";
  } else if (usuarioEdit.rol === "arrendador") {
    bloqueArr.hidden = false;
    document.getElementById("admUsrRfc").value = usuarioEdit.rfc || "";
    document.getElementById("admUsrCuenta").value = usuarioEdit.cuentaBancaria || "";
  }

  var btnEliminar = document.getElementById("btnEliminarUsrEditar");
  if (String(usuarioEdit.id) === String(adminActual.id)) {
    btnEliminar.hidden = true;
  }

  btnEliminar.addEventListener("click", function () {
    if (String(usuarioEdit.id) === String(adminActual.id)) return;

    var confirmar = window.confirm(
      '¿Seguro que deseas eliminar al usuario "' +
        NELL.nombreCompleto(usuarioEdit) +
        '" junto con todos sus datos asociados?'
    );
    if (!confirmar) return;

    var uid = String(usuarioEdit.id);
    var pubsUsuario = NELL.tablas.publicaciones.filtrar(function (p) {
      return String(p.arrendadorId) === uid;
    });
    var idsPubs = pubsUsuario.map(function (p) {
      return String(p.id);
    });

    NELL.tablas.publicaciones.eliminarDonde(function (p) {
      return String(p.arrendadorId) === uid;
    });
    NELL.tablas.resenas.eliminarDonde(function (r) {
      return (
        String(r.autorId) === uid || idsPubs.indexOf(String(r.publicacionId)) !== -1
      );
    });
    NELL.tablas.solicitudes.eliminarDonde(function (s) {
      return String(s.estudianteId) === uid || String(s.arrendadorId) === uid;
    });
    NELL.tablas.mensajes.eliminarDonde(function (m) {
      var partes = (m.conversacionId || "").split("__");
      return String(m.remitenteId) === uid || partes.indexOf(uid) !== -1;
    });
    NELL.tablas.usuarios.eliminar(uid);

    window.location.href = "usuarios.html";
  });

  var form = document.getElementById("formEditarUsuarioAdmin");
  var errorBox = document.getElementById("errorEditarUsrAdmin");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    errorBox.textContent = "";

    var nombre = document.getElementById("admUsrNombre").value.trim();
    var apellido = document.getElementById("admUsrApellido").value.trim();
    var correo = document.getElementById("admUsrCorreo").value.trim();
    var telefono = document.getElementById("admUsrTelefono").value.trim();
    var ciudad = document.getElementById("admUsrCiudad").value.trim();
    var nuevaPass = document.getElementById("admUsrNuevaPass").value;

    if (!nombre || !apellido || !correo) {
      errorBox.textContent = "Nombre, apellido y correo son obligatorios.";
      return;
    }

    var repetido = NELL.tablas.usuarios.filtrar(function (u) {
      return (
        String(u.id) !== String(usuarioEdit.id) &&
        (u.correo || "").toLowerCase() === correo.toLowerCase()
      );
    });

    if (repetido.length > 0) {
      errorBox.textContent = "Ese correo electrónico ya pertenece a otro usuario.";
      return;
    }

    var cambios = {
      nombre: nombre,
      apellido: apellido,
      correo: correo,
      telefono: telefono,
      ciudad: ciudad
    };

    if (usuarioEdit.rol === "estudiante") {
      cambios.universidad = document.getElementById("admUsrUniversidad").value.trim();
    } else if (usuarioEdit.rol === "arrendador") {
      cambios.rfc = document.getElementById("admUsrRfc").value.trim().toUpperCase();
      cambios.cuentaBancaria = document.getElementById("admUsrCuenta").value.trim();
    }

    if (nuevaPass) {
      if (nuevaPass.length < 4) {
        errorBox.textContent = "La nueva contraseña debe tener al menos 4 caracteres.";
        return;
      }
      cambios.contrasena = nuevaPass;
    }

    NELL.tablas.usuarios.actualizar(usuarioEdit.id, cambios);
    window.location.href = "usuarios.html";
  });
});