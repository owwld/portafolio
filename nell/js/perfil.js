/* =====================================================
   NELL - Perfil de usuario (estudiante / arrendador)
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var usuario = iniciarLayout();
  if (!usuario) return;

  function actualizarTarjetaLateral(u) {
    var avatarCont = document.getElementById("perfilAvatarContenedor");
    if (u.foto) {
      avatarCont.innerHTML =
        '<img src="' +
        NELL.escaparHTML(u.foto) +
        '" alt="Foto de perfil" class="vista-previa-avatar" />';
    } else {
      avatarCont.innerHTML =
        '<div class="avatar-grande">' +
        NELL.escaparHTML(NELL.obtenerIniciales(u.nombre, u.apellido)) +
        "</div>";
    }

    document.getElementById("perfilNombreCorto").textContent = NELL.nombreCorto(u);
    document.getElementById("perfilCiudad").textContent = u.ciudad || "León, Guanajuato";
    document.getElementById("perfilMiembroDesde").textContent =
      "Miembro desde " + (u.miembroDesde || "2024");

    var etiquetaRol = document.getElementById("perfilEtiquetaRol");
    var stats = document.getElementById("perfilStats");

    if (u.rol === "estudiante") {
      etiquetaRol.className = "subtitulo-pantalla";
      etiquetaRol.textContent = "Estudiante";

      var contratosEst = NELL.tablas.contratos.filtrar(function (c) {
        return String(c.estudianteId) === String(u.id);
      });
      stats.innerHTML = "<p>" + contratosEst.length + " contratos totales</p>";
    } else {
      etiquetaRol.className = "etiqueta-lila";
      etiquetaRol.textContent = "Arrendador";

      var pubsArr = NELL.tablas.publicaciones.filtrar(function (p) {
        return String(p.arrendadorId) === String(u.id) && p.estado === "Publicada";
      });
      var contratosArr = NELL.tablas.contratos.filtrar(function (c) {
        return String(c.arrendadorId) === String(u.id);
      });

      stats.innerHTML =
        "<p>" +
        pubsArr.length +
        " viviendas publicadas</p><p style='margin-top:6px;'>" +
        contratosArr.length +
        " contratos totales</p>";
    }
  }

  function cargarCamposFormulario(u) {
    document.getElementById("perfilNombre").value = u.nombre || "";
    document.getElementById("perfilApellido").value = u.apellido || "";
    document.getElementById("perfilCorreo").value = u.correo || "";
    document.getElementById("perfilTelefono").value = u.telefono || "";
    document.getElementById("perfilCiudadInput").value = u.ciudad || "";

    var grupoUni = document.getElementById("grupoUniversidadPerfil");
    if (u.rol === "estudiante") {
      grupoUni.hidden = false;
      document.getElementById("perfilUniversidad").value = u.universidad || "";
    } else {
      grupoUni.hidden = true;
    }
  }

  actualizarTarjetaLateral(usuario);
  cargarCamposFormulario(usuario);

  // Guardar datos personales
  var formDatos = document.getElementById("formDatosPerfil");
  var msgDatos = document.getElementById("msgDatosPerfil");

  formDatos.addEventListener("submit", function (e) {
    e.preventDefault();
    msgDatos.textContent = "";
    msgDatos.className = "mensaje-error";

    var nombre = document.getElementById("perfilNombre").value.trim();
    var apellido = document.getElementById("perfilApellido").value.trim();
    var correo = document.getElementById("perfilCorreo").value.trim();
    var telefono = document.getElementById("perfilTelefono").value.trim();
    var ciudad = document.getElementById("perfilCiudadInput").value.trim();

    if (!nombre || !apellido || !correo) {
      msgDatos.textContent = "Nombre, apellido y correo son obligatorios.";
      return;
    }

    var repetido = NELL.tablas.usuarios.filtrar(function (u) {
      return (
        String(u.id) !== String(usuario.id) &&
        (u.correo || "").toLowerCase() === correo.toLowerCase()
      );
    });

    if (repetido.length > 0) {
      msgDatos.textContent = "Ese correo ya está en uso por otra cuenta.";
      return;
    }

    var cambios = {
      nombre: nombre,
      apellido: apellido,
      correo: correo,
      telefono: telefono,
      ciudad: ciudad
    };

    if (usuario.rol === "estudiante") {
      cambios.universidad = document.getElementById("perfilUniversidad").value.trim();
    }

    usuario = NELL.tablas.usuarios.actualizar(usuario.id, cambios);
    iniciarLayout();
    actualizarTarjetaLateral(usuario);

    msgDatos.className = "mensaje-exito";
    msgDatos.textContent = "Cambios guardados correctamente.";
  });

  document.getElementById("btnCancelarPerfil").addEventListener("click", function () {
    msgDatos.textContent = "";
    cargarCamposFormulario(usuario);
  });

  // Cambiar contraseña
  var formPass = document.getElementById("formContrasenaPerfil");
  var msgPass = document.getElementById("msgPassPerfil");

  formPass.addEventListener("submit", function (e) {
    e.preventDefault();
    msgPass.textContent = "";
    msgPass.className = "mensaje-error";

    var nueva = document.getElementById("perfilNuevaPass").value;
    var confirmar = document.getElementById("perfilConfirmarPass").value;

    if (nueva.length < 4) {
      msgPass.textContent = "La contraseña debe tener al menos 4 caracteres.";
      return;
    }

    if (nueva !== confirmar) {
      msgPass.textContent = "Las contraseñas no coinciden.";
      return;
    }

    usuario = NELL.tablas.usuarios.actualizar(usuario.id, { contrasena: nueva });
    formPass.reset();
    msgPass.className = "mensaje-exito";
    msgPass.textContent = "Contraseña actualizada correctamente.";
  });
});