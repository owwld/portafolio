/* =====================================================
   NELL - Chat online (compartido estudiante / arrendador)
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var usuario = iniciarLayout();
  if (!usuario) return;

  var raiz = document.body.getAttribute("data-raiz") || "../";
  var btnVolver = document.getElementById("btnVolverChat");
  btnVolver.addEventListener("click", function () {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href =
        usuario.rol === "estudiante" ? "historial.html" : "solicitudes.html";
    }
  });

  var conParam = NELL.obtenerParametro("con") || "";
  if (!conParam) {
    window.location.href =
      usuario.rol === "estudiante" ? "inicio.html" : "publicaciones.html";
    return;
  }

  // Resolver nombre e ID de la otra persona (puede ser usuario registrado o contacto externo)
  var otroId = conParam;
  var otroNombre = conParam;

  var usuarioDestino = NELL.tablas.usuarios.buscar(conParam);
  if (usuarioDestino) {
    otroId = usuarioDestino.id;
    otroNombre = NELL.nombreCorto(usuarioDestino);
  } else {
    var solicitudes = NELL.tablas.solicitudes.todos();
    for (var i = 0; i < solicitudes.length; i++) {
      if (String(solicitudes[i].estudianteId) === String(conParam)) {
        otroNombre = solicitudes[i].estudianteNombre;
        break;
      }
      if (String(solicitudes[i].arrendadorId) === String(conParam)) {
        otroNombre = solicitudes[i].arrendadorNombre;
        break;
      }
    }

    var contratos = NELL.tablas.contratos.todos();
    for (var j = 0; j < contratos.length; j++) {
      if (String(contratos[j].estudianteId) === String(conParam)) {
        otroNombre = contratos[j].estudianteNombre;
        break;
      }
      if (String(contratos[j].arrendadorId) === String(conParam)) {
        otroNombre = contratos[j].arrendadorNombre;
        break;
      }
    }
  }

  document.getElementById("tituloChatCon").textContent = "Chat con " + otroNombre;

  var convId = NELL.idConversacion(usuario.id, otroId);
  var areaMensajes = document.getElementById("areaMensajes");

  function renderizarMensajes() {
    var lista = NELL.tablas.mensajes.filtrar(function (m) {
      return m.conversacionId === convId;
    });

    if (lista.length === 0) {
      areaMensajes.innerHTML =
        '<p class="subtitulo-pantalla" style="text-align:center; margin:auto;">Aún no hay mensajes. Escribe el primero para iniciar la conversación.</p>';
      return;
    }

    areaMensajes.innerHTML = lista
      .map(function (m) {
        var esPropio = String(m.remitenteId) === String(usuario.id);
        var claseFila = esPropio ? "fila-mensaje propio" : "fila-mensaje ajeno";
        var claseBurbuja =
          m.remitenteRol === "arrendador"
            ? "burbuja-arrendador"
            : "burbuja-estudiante";

        return (
          '<div class="' +
          claseFila +
          '">' +
          '<span class="autor-mensaje">' +
          NELL.escaparHTML(m.remitenteNombre) +
          "</span>" +
          '<div class="' +
          claseBurbuja +
          '">' +
          NELL.escaparHTML(m.texto) +
          "</div>" +
          "</div>"
        );
      })
      .join("");

    areaMensajes.scrollTop = areaMensajes.scrollHeight;
  }

  renderizarMensajes();

  var formChat = document.getElementById("formEnviarMensaje");
  var inputChat = document.getElementById("inputMensajeChat");

  formChat.addEventListener("submit", function (e) {
    e.preventDefault();
    var texto = inputChat.value.trim();
    if (!texto) return;

    var ahora = new Date();
    var fechaTexto =
      NELL.fechaHoyISO() +
      " " +
      String(ahora.getHours()).padStart(2, "0") +
      ":" +
      String(ahora.getMinutes()).padStart(2, "0");

    NELL.tablas.mensajes.agregar({
      conversacionId: convId,
      remitenteId: usuario.id,
      remitenteNombre: NELL.nombreCorto(usuario),
      remitenteRol: usuario.rol,
      texto: texto,
      fecha: fechaTexto
    });

    inputChat.value = "";
    renderizarMensajes();
  });
});