/* =====================================================
   NELL - Información de contrato (estudiante / arrendador)
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var usuario = iniciarLayout();
  if (!usuario) return;

  var btnVolver = document.getElementById("btnVolverContrato");
  btnVolver.addEventListener("click", function () {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href =
        usuario.rol === "estudiante" ? "historial.html" : "contratos.html";
    }
  });

  var id = NELL.obtenerParametro("id");
  var contrato = id ? NELL.tablas.contratos.buscar(id) : null;

  if (!contrato) {
    window.location.href =
      usuario.rol === "estudiante" ? "historial.html" : "contratos.html";
    return;
  }

  // Datos del estudiante y arrendador (desde cuenta si existe o desde el contrato)
  var uEst = NELL.tablas.usuarios.buscar(contrato.estudianteId);
  var uArr = NELL.tablas.usuarios.buscar(contrato.arrendadorId);

  var estNombre = uEst ? NELL.nombreCorto(uEst) : contrato.estudianteNombre;
  var estCiudad = uEst ? uEst.ciudad : contrato.estudianteCiudad || "León, Guanajuato";
  var estTelefono = uEst ? uEst.telefono : contrato.estudianteTelefono || "477 000 0000";

  var arrNombre = uArr ? NELL.nombreCorto(uArr) : contrato.arrendadorNombre;
  var arrCiudad = uArr ? uArr.ciudad : contrato.arrendadorCiudad || "León, Guanajuato";
  var arrTelefono = uArr ? uArr.telefono : contrato.arrendadorTelefono || "477 000 0000";

  document.getElementById("estIniciales").textContent = NELL.obtenerIniciales(estNombre);
  document.getElementById("estNombre").textContent = estNombre;
  document.getElementById("estCiudad").textContent = estCiudad;
  document.getElementById("estTelefono").textContent = estTelefono;

  document.getElementById("arrIniciales").textContent = NELL.obtenerIniciales(arrNombre);
  document.getElementById("arrNombre").textContent = arrNombre;
  document.getElementById("arrCiudad").textContent = arrCiudad;
  document.getElementById("arrTelefono").textContent = arrTelefono;

  document.getElementById("conVivienda").textContent = contrato.viviendaTitulo;
  document.getElementById("conDireccion").textContent = contrato.colonia;
  document.getElementById("conRenta").textContent = NELL.formatoDinero(contrato.renta);
  document.getElementById("conDeposito").textContent = NELL.formatoDinero(contrato.deposito);
  document.getElementById("conInicio").textContent = NELL.formatearFecha(contrato.fechaInicio);
  document.getElementById("conDuracion").textContent = contrato.duracion + " meses";

  // Botón descargar resumen PDF (impresión limpia)
  document.getElementById("btnDescargarPdf").addEventListener("click", function () {
    window.print();
  });

  // Botón chat online
  var otroContacto =
    usuario.rol === "estudiante"
      ? contrato.arrendadorId || contrato.arrendadorNombre
      : contrato.estudianteId || contrato.estudianteNombre;

  document.getElementById("btnChatContrato").href =
    "chat.html?con=" + encodeURIComponent(otroContacto);

  // Zona opcional de subir contrato (solo presente en arrendador/contrato.html)
  var zonaSubir = document.getElementById("zonaSubirContrato");
  var inputArchivo = document.getElementById("inputArchivoContrato");
  var textoArchivo = document.getElementById("nombreArchivoContrato");

  if (zonaSubir && inputArchivo && textoArchivo) {
    if (contrato.archivoContrato) {
      textoArchivo.textContent = "Archivo cargado: " + contrato.archivoContrato;
    }

    zonaSubir.addEventListener("click", function () {
      inputArchivo.click();
    });

    inputArchivo.addEventListener("change", function () {
      if (inputArchivo.files && inputArchivo.files[0]) {
        var nombreArchivo = inputArchivo.files[0].name;
        NELL.tablas.contratos.actualizar(contrato.id, {
          archivoContrato: nombreArchivo
        });
        textoArchivo.textContent = "Archivo cargado: " + nombreArchivo;
      }
    });
  }
});