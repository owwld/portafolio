/* =====================================================
   NELL - Formulario de publicación (crear / editar)
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var usuario = iniciarLayout();
  if (!usuario) return;

  var modo = document.body.getAttribute("data-modo") || "crear";
  var pubId = NELL.obtenerParametro("id");
  var pubActual = null;

  var fotos = [];
  var indiceActivo = 0;

  var inputTitulo = document.getElementById("pubTitulo");
  var inputDescripcion = document.getElementById("pubDescripcion");
  var inputPrecio = document.getElementById("pubPrecio");
  var selectTipo = document.getElementById("pubTipo");
  var inputUniversidad = document.getElementById("pubUniversidad");
  var inputDireccion = document.getElementById("pubDireccion");
  var inputHabitaciones = document.getElementById("pubHabitaciones");
  var contenedorChips = document.getElementById("chipsAmenidadesForm");
  var fotoPrincipal = document.getElementById("fotoPrincipalForm");
  var contenedorMini = document.getElementById("miniaturasForm");
  var inputFotos = document.getElementById("inputFotosPub");
  var errorBox = document.getElementById("errorPubForm");

  // Si es edición, validar propiedad y precargar campos
  if (modo === "editar") {
    pubActual = pubId ? NELL.tablas.publicaciones.buscar(pubId) : null;
    if (!pubActual || String(pubActual.arrendadorId) !== String(usuario.id)) {
      window.location.href = "publicaciones.html";
      return;
    }

    inputTitulo.value = pubActual.titulo || "";
    inputDescripcion.value = pubActual.descripcion || "";
    inputPrecio.value = pubActual.precio || "";
    selectTipo.value = pubActual.tipo || "";
    inputUniversidad.value = pubActual.universidad || "";
    inputDireccion.value = pubActual.direccion || "";
    inputHabitaciones.value = pubActual.habitaciones || 1;
    fotos = (pubActual.fotos || []).slice(0, 3);

    var amenidadesGuardadas = pubActual.amenidades || [];
    var chips = contenedorChips.querySelectorAll(".chip-seleccionable");
    for (var i = 0; i < chips.length; i++) {
      var nom = chips[i].getAttribute("data-amenidad");
      if (amenidadesGuardadas.indexOf(nom) !== -1) {
        chips[i].classList.add("seleccionado");
      }
    }
  }

  // Selección de amenidades
  contenedorChips.addEventListener("click", function (e) {
    var chip = e.target.closest(".chip-seleccionable");
    if (!chip) return;
    chip.classList.toggle("seleccionado");
  });

  function obtenerAmenidadesSeleccionadas() {
    var seleccionadas = [];
    var chips = contenedorChips.querySelectorAll(".chip-seleccionable.seleccionado");
    for (var i = 0; i < chips.length; i++) {
      seleccionadas.push(chips[i].getAttribute("data-amenidad"));
    }
    return seleccionadas;
  }

  // Renderizar galería de fotos (máximo 3)
  function renderizarFotos() {
    if (indiceActivo >= fotos.length) {
      indiceActivo = Math.max(0, fotos.length - 1);
    }

    if (fotos.length > 0) {
      fotoPrincipal.style.background = "";
      fotoPrincipal.innerHTML =
        '<img src="' + NELL.escaparHTML(fotos[indiceActivo]) + '" alt="Foto principal" />';
    } else {
      fotoPrincipal.innerHTML = "";
      fotoPrincipal.style.background = NELL.degradadoPorDefecto(
        pubActual ? pubActual.id : "nueva"
      );
    }

    var htmlMini = "";
    for (var i = 0; i < fotos.length; i++) {
      var activa = i === indiceActivo ? " activa" : "";
      htmlMini +=
        '<div class="miniatura-item' +
        activa +
        '" data-ver="' +
        i +
        '">' +
        '<img src="' +
        NELL.escaparHTML(fotos[i]) +
        '" alt="Miniatura ' +
        (i + 1) +
        '" />' +
        '<button type="button" class="btn-quitar-foto" data-quitar="' +
        i +
        '" title="Quitar">×</button>' +
        "</div>";
    }

    if (fotos.length < 3) {
      htmlMini +=
        '<div id="btnAgregarFotoBox" class="cuadro-agregar-foto" title="Agregar fotografía">+</div>';
    }

    contenedorMini.innerHTML = htmlMini;
  }

  contenedorMini.addEventListener("click", function (e) {
    var btnQuitar = e.target.closest("[data-quitar]");
    if (btnQuitar) {
      var idxQuitar = Number(btnQuitar.getAttribute("data-quitar"));
      fotos.splice(idxQuitar, 1);
      renderizarFotos();
      return;
    }

    var btnAgregar = e.target.closest("#btnAgregarFotoBox");
    if (btnAgregar) {
      inputFotos.click();
      return;
    }

    var itemVer = e.target.closest("[data-ver]");
    if (itemVer) {
      indiceActivo = Number(itemVer.getAttribute("data-ver"));
      renderizarFotos();
    }
  });

  inputFotos.addEventListener("change", function () {
    if (!inputFotos.files || !inputFotos.files[0]) return;
    if (fotos.length >= 3) return;

    NELL.reducirImagenCanvas(inputFotos.files[0], function (dataUrl) {
      fotos.push(dataUrl);
      indiceActivo = fotos.length - 1;
      inputFotos.value = "";
      renderizarFotos();
    });
  });

  renderizarFotos();

  function guardarPublicacion(estadoFinal) {
    errorBox.textContent = "";

    var titulo = inputTitulo.value.trim();
    var descripcion = inputDescripcion.value.trim();
    var precio = Number(inputPrecio.value) || 0;
    var tipo = selectTipo.value;
    var universidad = inputUniversidad.value.trim();
    var direccion = inputDireccion.value.trim();
    var habitaciones = Math.max(1, Number(inputHabitaciones.value) || 1);

    if (estadoFinal === "Publicada") {
      if (!titulo || precio <= 0 || !tipo || !direccion) {
        errorBox.textContent =
          "Para publicar la vivienda debes completar título, precio válido, tipo de vivienda y dirección.";
        return;
      }
    } else {
      if (!titulo) {
        errorBox.textContent = "Para guardar un borrador debes escribir al menos el título.";
        return;
      }
    }

    var colonia = NELL.extraerColonia(direccion);
    var datos = {
      arrendadorId: usuario.id,
      titulo: titulo,
      descripcion: descripcion,
      precio: precio,
      deposito: pubActual ? Number(pubActual.deposito) || precio : precio,
      tipo: tipo || "Casa",
      universidad: universidad,
      direccion: direccion,
      colonia: colonia,
      habitaciones: habitaciones,
      amenidades: obtenerAmenidadesSeleccionadas(),
      fotos: fotos.slice(0, 3),
      estado: estadoFinal
    };

    if (modo === "editar" && pubActual) {
      NELL.tablas.publicaciones.actualizar(pubActual.id, datos);
    } else {
      NELL.tablas.publicaciones.agregar(datos);
    }

    window.location.href = "publicaciones.html";
  }

  document.getElementById("btnPublicarVivienda").addEventListener("click", function () {
    guardarPublicacion("Publicada");
  });

  document.getElementById("btnGuardarBorrador").addEventListener("click", function () {
    guardarPublicacion("Borrador");
  });

  var btnEliminar = document.getElementById("btnEliminarPublicacion");
  if (btnEliminar && pubActual) {
    btnEliminar.addEventListener("click", function () {
      var confirmar = window.confirm(
        '¿Seguro que deseas eliminar "' + pubActual.titulo + '"?'
      );
      if (!confirmar) return;

      NELL.tablas.publicaciones.eliminar(pubActual.id);
      NELL.tablas.resenas.eliminarDonde(function (r) {
        return String(r.publicacionId) === String(pubActual.id);
      });
      window.location.href = "publicaciones.html";
    });
  }
});