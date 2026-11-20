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
        // Redirigir a la pagina a la que corresponde
        window.location.href = usuarioAutenticado.url;
    } else {
        document.getElementById('errorMsg').classList.remove('d-none');
    }
}

function saltarLoginSiAutenticado() {
    const sesion = JSON.parse(sessionStorage.getItem('sesionActiva'));
    if (sesion) {
        window.location.href = sesion.url;
    }
}

function cerrarSesion() {
    sessionStorage.removeItem('sesionActiva');
    window.location.href = 'index.html';
}