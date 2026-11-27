// base de usrs local
const base = [
    { user: 'admin', pass: '1234', rol: 'Administrador', url: 'admin.html' },
    { user: 'us1', pass: '1234', rol: 'Usuario', url: 'usuario1.html' },
    { user: 'us2', pass: '1234', rol: 'Usuario', url: 'usuario2.html' }
];

// iniciar sesion
function iniciarSesion(e) {
    e.preventDefault();
    const inputUser = document.getElementById('inputUser').value.trim();
    const inputPass = document.getElementById('inputPass').value.trim();
    const usuarioAutenticado = base.find(
        u => u.user === inputUser && u.pass === inputPass
    );

    if (usuarioAutenticado) {
        // Almacenar datos en SESSIONSTORAGE
        sessionStorage.setItem('sesionActiva', JSON.stringify(usuarioAutenticado));
        
        // Registrar acceso
        registrarAcceso();

        // Redirigir a la pagina a la que corresponde
        window.location.href = usuarioAutenticado.url;
    } else {
        document.getElementById('errorMsg').classList.remove('d-none');
    }
}

function saltarLoginSiAutenticado() {
    const sesion = JSON.parse(sessionStorage.getItem('sesionActiva'));
    if (sesion) {
        alert(
            "────────────────────────\n" +
            "Ya tienes una sesión iniciada como " + sesion.rol + ".\n\n" +
            "Redirigiendo a tu panel..."
        );
        window.location.href = sesion.url;
    }
}

function cerrarSesion() {
    const confirmar = confirm(
        "────────────────────────\n" +
        "¿Estás seguro de que deseas salir del sistema?\n\n" +
        "• Aceptar: Finalizar sesión\n" +
        "• Cancelar: Permanecer aquí"
    );

    if (confirmar) {
        sessionStorage.removeItem('sesionActiva');
        window.location.href = 'index.html';
    }
}

function registrarAcceso() {
    let accesos = JSON.parse(sessionStorage.getItem('registroAccesos')) || [];

    const ahora = new Date();
    const fecha = ahora.getFullYear() + "-" +
                  String(ahora.getMonth() + 1).padStart(2, '0') + "-" +
                  String(ahora.getDate()).padStart(2, '0');
    const hora = String(ahora.getHours()).padStart(2, '0') + ":" +
                 String(ahora.getMinutes()).padStart(2, '0') + ":" +
                 String(ahora.getSeconds()).padStart(2, '0');

    accesos.push("Acceso " + (accesos.length + 1) + ": " + fecha + " " + hora);
    sessionStorage.setItem('registroAccesos', JSON.stringify(accesos));
}