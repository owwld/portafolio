// =========================================================================
// js/catalogo.js - Conecta los botones y el buscador de catalogo.html
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
    if (verificarSesion()) {
        cargarCatalogo(1, '');
    }

    document.getElementById('formBusqueda').addEventListener('submit', (e) => {
        e.preventDefault();
        cargarCatalogo(1, document.getElementById('inputBusqueda').value);
    });

    document.getElementById('btnLimpiar').addEventListener('click', () => {
        document.getElementById('inputBusqueda').value = '';
        cargarCatalogo(1, '');
    });

    document.getElementById('btnAnterior').addEventListener('click', () => {
        cargarCatalogo(paginaActual - 1, busquedaActual);
    });

    document.getElementById('btnSiguiente').addEventListener('click', () => {
        cargarCatalogo(paginaActual + 1, busquedaActual);
    });
});