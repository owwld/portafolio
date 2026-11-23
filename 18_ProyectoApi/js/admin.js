// Verifica que quien entro sea Administrador; si es un usuario normal, lo envia a su perfil
const sesionAdmin = verificarSesion();
if (sesionAdmin && sesionAdmin.rol !== 'Administrador') {
    window.location.replace('perfiles.html');
}

// Dibuja en la tabla todas las cuentas guardadas en la memoria del navegador
function dibujarTabla() {
    const lista = obtenerUsuarios();
    const tbody = document.getElementById('tablaUsuarios');
    tbody.innerHTML = '';

    lista.forEach((u, index) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td class="fw-bold">${u.nombre || u.user}</td>
            <td><code>${u.user}</code></td>
            <td>${u.pass}</td>
            <td><span class="badge ${u.rol === 'Administrador' ? 'bg-dark' : 'bg-primary'}">${u.rol}</span></td>
            <td class="text-end">
                <button type="button" class="btn btn-sm btn-outline-primary btn-editar">Editar</button>
                <button type="button" class="btn btn-sm btn-outline-danger btn-eliminar" ${u.user === 'admin' ? 'disabled' : ''}>Eliminar</button>
            </td>
        `;

        // Conecta el boton Editar de esta fila
        fila.querySelector('.btn-editar').addEventListener('click', () => editarCuenta(index));

        // Conecta el boton Eliminar de esta fila
        fila.querySelector('.btn-eliminar').addEventListener('click', () => eliminarCuenta(index));

        tbody.appendChild(fila);
    });
}

// Pasa los datos de una cuenta al formulario izquierdo para poder modificarlos
function editarCuenta(index) {
    const u = obtenerUsuarios()[index];
    document.getElementById('editIndex').value = index;
    document.getElementById('campoNombre').value = u.nombre || u.user;
    document.getElementById('campoUser').value = u.user;
    document.getElementById('campoPass').value = u.pass;
    document.getElementById('campoRol').value = u.rol;

    document.getElementById('tituloForm').textContent = 'Modificar Cuenta';
    document.getElementById('btnCancelarEdicion').classList.remove('d-none');
}

// Borra completamente la cuenta del localStorage junto con sus serpientes guardadas
function eliminarCuenta(index) {
    if (!confirm('¿Eliminar esta cuenta y sus datos guardados?')) return;
    const lista = obtenerUsuarios();
    const usuarioEliminado = lista[index];

    // Borra del localStorage la lista personal de serpientes favoritas de ese usuario
    if (usuarioEliminado && usuarioEliminado.user) {
        localStorage.removeItem(`favs_${usuarioEliminado.user}`);
    }

    // Quita la cuenta de la lista general y actualiza el localStorage
    lista.splice(index, 1);
    guardarUsuarios(lista);
    dibujarTabla();
}

// Limpia las cajas de texto del formulario
function resetearFormulario() {
    document.getElementById('formUsuario').reset();
    document.getElementById('editIndex').value = '-1';
    document.getElementById('tituloForm').textContent = 'Agregar Cuenta';
    document.getElementById('btnCancelarEdicion').classList.add('d-none');
}

// Inicia los eventos cuando carga la pagina admin.html
document.addEventListener('DOMContentLoaded', () => {
    dibujarTabla();

    document.getElementById('formUsuario').addEventListener('submit', (e) => {
        e.preventDefault();
        const lista = obtenerUsuarios();
        const index = parseInt(document.getElementById('editIndex').value);
        const rol = document.getElementById('campoRol').value;

        const datosCuenta = {
            nombre: document.getElementById('campoNombre').value.trim(),
            user: document.getElementById('campoUser').value.trim(),
            pass: document.getElementById('campoPass').value.trim(),
            rol: rol,
            url: rol === 'Administrador' ? 'admin.html' : 'perfiles.html'
        };

        if (index === -1) {
            lista.push(datosCuenta);
        } else {
            lista[index] = datosCuenta;
        }

        guardarUsuarios(lista);
        resetearFormulario();
        dibujarTabla();
    });

    document.getElementById('btnCancelarEdicion').addEventListener('click', resetearFormulario);
});