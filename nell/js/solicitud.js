/* =====================================================
   NELL - Solicitud de renta (estudiante/solicitud.html)
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var usuario = iniciarLayout();
  if (!usuario) return;

  var id = NELL.obtenerParametro("id");
  var pub = id ? NELL.tablas.publicaciones.buscar(id) : null;

  if (!pub) {
    window.location.href = "inicio.html";
    return;
  }

  var urlDetalle = "detalle.html?id=" + encodeURIComponent(pub.id);
  document.getElementById("btnVolverSolicitud").href = urlDetalle;
  document.getElementById("btnCancelarSolicitud").href = urlDetalle;
  document.getElementById("subtituloSolicitud").textContent =
    pub.titulo + " - " + pub.colonia;

  var inputFecha = document.getElementById("solFechaInicio");
  inputFecha.value = NELL.fechaHoyISO();

  var selectDuracion = document.getElementById("solDuracion");
  var precio = Number(pub.precio) || 0;
  var deposito = Number(pub.deposito) || 0;

  document.getElementById("resumenPrecio").textContent = NELL.formatoDinero(precio);
  document.getElementById("resumenDeposito").textContent = NELL.formatoDinero(deposito);
  document.getElementById("resumenTotal").textContent = NELL.formatoDinero(precio + deposito);

  selectDuracion.addEventListener("change", function () {
    document.getElementById("resumenDuracion").textContent =
      selectDuracion.value + " Meses";
  });

  // Zona INE
  var archivoIneNombre = "";
  var zonaIne = document.getElementById("zonaIne");
  var inputIne = document.getElementById("inputIne");
  var textoIne = document.getElementById("nombreArchivoIne");

  zonaIne.addEventListener("click", function () {
    inputIne.click();
  });

  inputIne.addEventListener("change", function () {
    if (inputIne.files && inputIne.files[0]) {
      archivoIneNombre = inputIne.files[0].name;
      textoIne.textContent = "INE seleccionada: " + archivoIneNombre;
    }
  });

  // Verificar si ya existe solicitud pendiente del mismo estudiante para esta vivienda
  var pendientes = NELL.tablas.solicitudes.filtrar(function (s) {
    return (
      String(s.publicacionId) === String(pub.id) &&
      String(s.estudianteId) === String(usuario.id) &&
      s.estado === "Pendiente"
    );
  });

  var btnEnviar = document.getElementById("btnEnviarSolicitud");
  if (pendientes.length > 0) {
    document.getElementById("avisoSolicitudExistente").hidden = false;
    btnEnviar.disabled = true;
  }

  var form = document.getElementById("formSolicitud");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (pendientes.length > 0) return;

    var arrendador = NELL.tablas.usuarios.buscar(pub.arrendadorId);
    var inputDoc = document.getElementById("solDocumentos");
    var docNombre =
      inputDoc.files && inputDoc.files[0] ? inputDoc.files[0].name : "";

    NELL.tablas.solicitudes.agregar({
      publicacionId: pub.id,
      viviendaTitulo: pub.titulo,
      colonia: pub.colonia,
      arrendadorId: pub.arrendadorId,
      arrendadorNombre: arrendador ? NELL.nombreCorto(arrendador) : "Arrendador",
      estudianteId: usuario.id,
      estudianteNombre: NELL.nombreCorto(usuario),
      estudianteCorreo: usuario.correo,
      estudianteTelefono: usuario.telefono,
      estudianteCiudad: usuario.ciudad,
      estudianteUniversidad: usuario.universidad,
      estudianteMiembroDesde: usuario.miembroDesde,
      fechaInicio: inputFecha.value || NELL.fechaHoyISO(),
      duracion: Number(selectDuracion.value) || 12,
      renta: precio,
      deposito: deposito,
      mensaje: document.getElementById("solMensaje").value.trim(),
      documentosAdjuntos: docNombre,
      archivoINE: archivoIneNombre,
      estado: "Pendiente",
      contratoId: ""
    });

    window.location.href = "historial.html";
  });
});