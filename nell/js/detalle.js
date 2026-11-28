/* =====================================================
   NELL - Detalle de vivienda (estudiante/detalle.html)
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

  var fotoPrincipal = document.getElementById("detalleFotoPrincipal");
  var contenedorMini = document.getElementById("detalleMiniaturas");

  // Prepara 3 elementos visuales (fotos reales o degradados variantes)
  var itemsVisuales = [];
  if (pub.fotos && pub.fotos.length > 0) {
    for (var i = 0; i < 3; i++) {
      if (pub.fotos[i]) {
        itemsVisuales.push({ tipo: "foto", valor: pub.fotos[i] });
      }
    }
  }
  while (itemsVisuales.length < 3) {
    itemsVisuales.push({
      tipo: "degradado",
      valor: NELL.degradadoPorDefecto(pub.id + "_" + itemsVisuales.length)
    });
  }

  function mostrarPrincipal(indice) {
    var item = itemsVisuales[indice];
    if (item.tipo === "foto") {
      fotoPrincipal.style.background = "";
      fotoPrincipal.innerHTML =
        '<img src="' + NELL.escaparHTML(item.valor) + '" alt="' + NELL.escaparHTML(pub.titulo) + '" />';
    } else {
      fotoPrincipal.innerHTML = "";
      fotoPrincipal.style.background = item.valor;
    }

    var minis = contenedorMini.querySelectorAll(".miniatura-item");
    for (var k = 0; k < minis.length; k++) {
      minis[k].classList.toggle("activa", k === indice);
    }
  }

  contenedorMini.innerHTML = itemsVisuales
    .map(function (item, idx) {
      if (item.tipo === "foto") {
        return (
          '<div class="miniatura-item" data-indice="' +
          idx +
          '"><img src="' +
          NELL.escaparHTML(item.valor) +
          '" alt="Vista ' +
          (idx + 1) +
          '" /></div>'
        );
      }
      return (
        '<div class="miniatura-item" data-indice="' +
        idx +
        '" style="background: ' +
        item.valor +
        ';"></div>'
      );
    })
    .join("");

  contenedorMini.addEventListener("click", function (e) {
    var tarjeta = e.target.closest(".miniatura-item");
    if (!tarjeta) return;
    mostrarPrincipal(Number(tarjeta.getAttribute("data-indice")));
  });

  mostrarPrincipal(0);

  // Descripción y amenidades
  document.getElementById("detalleDescripcion").textContent =
    pub.descripcion || "Sin descripción adicional.";

  document.getElementById("detalleAmenidades").innerHTML = (pub.amenidades || [])
    .map(function (am) {
      return '<span class="chip">' + NELL.escaparHTML(am) + "</span>";
    })
    .join("");

  document.getElementById("detalleHabitaciones").textContent =
    "Habitaciones disponibles: " + (pub.habitaciones || 1);

  document.getElementById("btnVerResenas").href =
    "resenas.html?id=" + encodeURIComponent(pub.id);

  // Panel derecho de renta
  document.getElementById("detalleTitulo").textContent = pub.titulo;
  document.getElementById("detallePrecio").textContent =
    NELL.formatoDinero(pub.precio) + "/mes";
  document.getElementById("detalleDepositoUni").textContent =
    "Deposito " + NELL.formatoDinero(pub.deposito) + " - " + (pub.universidad || "León");

  document.getElementById("btnSolicitarRenta").href =
    "solicitud.html?id=" + encodeURIComponent(pub.id);
  document.getElementById("btnContactarArr").href =
    "chat.html?con=" + encodeURIComponent(pub.arrendadorId);

  // Información del arrendador
  var arrendador = NELL.tablas.usuarios.buscar(pub.arrendadorId);
  var nombreArr = arrendador ? NELL.nombreCorto(arrendador) : "Arrendador";
  document.getElementById("arrDetalleIniciales").textContent = NELL.obtenerIniciales(nombreArr);
  document.getElementById("arrDetalleNombre").textContent = nombreArr;
  document.getElementById("arrDetalleMiembro").textContent =
    "Miembro desde " + (arrendador ? arrendador.miembroDesde : "2021");
  document.getElementById("arrDetalleTelefono").textContent =
    "Tel: " + (arrendador ? arrendador.telefono : "477 000 0000");
  document.getElementById("arrDetalleCorreo").textContent =
    "Correo: " + (arrendador ? arrendador.correo : "");
});