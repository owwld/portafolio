// Lista de cuentas que se crean automaticamente la primera vez que se abre la pagina
const baseInicial = [
    { user: 'admin', pass: '1234', nombre: 'Administrador', rol: 'Administrador', url: 'admin.html' },
    { user: 'us1', pass: '1234', nombre: 'Usuario 1', rol: 'Usuario', url: 'perfiles.html' },
    { user: 'us2', pass: '1234', nombre: 'Usuario 2', rol: 'Usuario', url: 'perfiles.html' }
];

// Revisa la memoria del navegador para obtener las cuentas registradas.
// Si todavia no existe ningun registro en memoria, crea las cuentas iniciales.
function obtenerUsuarios() {
    const guardado = localStorage.getItem('usuarios_sistema');
    if (guardado === null) {
        localStorage.setItem('usuarios_sistema', JSON.stringify(baseInicial));
        return [...baseInicial];
    }
    return JSON.parse(guardado) || [];
}

// Guarda la lista actualizada de cuentas en la memoria del navegador
function guardarUsuarios(lista) {
    localStorage.setItem('usuarios_sistema', JSON.stringify(lista));
}

// Decide a que pantalla enviar a la persona despues de entrar:
// - Si es Administrador, lo envia al panel de control (admin.html).
// - Si es un usuario normal y ya tiene serpientes guardadas, lo envia a su perfil (perfiles.html).
// - Si es un usuario normal y aun no guarda ninguna serpiente, lo envia al catalogo (catalogo.html).
function obtenerRutaDestino(usuarioObj) {
    if (usuarioObj.rol === 'Administrador') {
        return 'admin.html';
    }
    const guardadas = JSON.parse(localStorage.getItem(`favs_${usuarioObj.user}`)) || [];
    return guardadas.length > 0 ? 'perfiles.html' : 'catalogo.html';
}

// Revisa si el usuario y la contrasena escritos en el formulario son correctos
function iniciarSesion(e) {
    e.preventDefault();
    const inputUser = document.getElementById('inputUser').value.trim();
    const inputPass = document.getElementById('inputPass').value.trim();
    const base = obtenerUsuarios();

    const usuarioAutenticado = base.find(
        u => u.user === inputUser && u.pass === inputPass
    );

    if (usuarioAutenticado) {
        sessionStorage.setItem('sesionActiva', JSON.stringify(usuarioAutenticado));
        window.location.replace(obtenerRutaDestino(usuarioAutenticado));
    } else {
        document.getElementById('errorMsg').classList.remove('d-none');
    }
}

// Crea una cuenta nueva cuando alguien llena el formulario de registro en la pagina principal
function registrarUsuario(e) {
    e.preventDefault();

    const nombre = document.getElementById('regNombre').value.trim();
    const user = document.getElementById('regUser').value.trim();
    const pass = document.getElementById('regPass').value.trim();
    const passConfirm = document.getElementById('regPassConfirm').value.trim();
    const errorBox = document.getElementById('regErrorMsg');

    errorBox.classList.add('d-none');

    if (pass !== passConfirm) {
        errorBox.textContent = 'Las contraseñas no coinciden.';
        errorBox.classList.remove('d-none');
        return;
    }

    const lista = obtenerUsuarios();
    const yaExiste = lista.some(u => u.user.toLowerCase() === user.toLowerCase());

    if (yaExiste) {
        errorBox.textContent = 'Ese nombre de usuario ya está en uso. Elige otro.';
        errorBox.classList.remove('d-none');
        return;
    }

    const nuevoUsuario = {
        user: user,
        pass: pass,
        nombre: nombre,
        rol: 'Usuario',
        url: 'perfiles.html'
    };

    lista.push(nuevoUsuario);
    guardarUsuarios(lista);

    sessionStorage.setItem('sesionActiva', JSON.stringify(nuevoUsuario));
    window.location.replace('catalogo.html');
}

// Si la persona ya habia iniciado sesion antes, evita mostrar el login de nuevo
function saltarLoginSiAutenticado() {
    const sesion = JSON.parse(sessionStorage.getItem('sesionActiva'));
    if (sesion && sesion.user) {
        window.location.replace(obtenerRutaDestino(sesion));
    }
}

// Borra la sesion activa y regresa a la pantalla de inicio de sesion
function cerrarSesion() {
    sessionStorage.removeItem('sesionActiva');
    window.location.replace('index.html');
}

// Protege las pantallas internas: si alguien intenta entrar sin haber iniciado sesion, lo regresa al inicio
function verificarSesion() {
    const sesion = JSON.parse(sessionStorage.getItem('sesionActiva'));
    if (!sesion || !sesion.user) {
        sessionStorage.removeItem('sesionActiva');
        window.location.replace('index.html');
        return null;
    }
    return sesion;
}

// Conecta automaticamente los botones y formularios cuando carga la pagina
document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        saltarLoginSiAutenticado();
        formLogin.addEventListener('submit', iniciarSesion);
    }

    const formRegistro = document.getElementById('formRegistro');
    if (formRegistro) {
        formRegistro.addEventListener('submit', registrarUsuario);
    }

    const btnSalir = document.getElementById('btnSalir');
    if (btnSalir) {
        btnSalir.addEventListener('click', cerrarSesion);
    }
});