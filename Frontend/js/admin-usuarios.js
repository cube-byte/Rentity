// Configuración de la API
const API_URL = 'http://localhost:9090/api/admin/usuarios';
let currentPage = 0;
const pageSize = 10;
let totalPages = 1;
let usuarioIdEliminar = null;

// === CARGAR USUARIOS ===
async function cargarUsuarios(page = 0) {
    try {
        const search = document.getElementById('searchUsuarios').value;
        const rol = document.getElementById('filterRol').value;
        const estado = document.getElementById('filterEstado').value;

        let url = `${API_URL}?page=${page}&size=${pageSize}`;
        
        if (search) {
            url += `&search=${encodeURIComponent(search)}`;
        }
        if (rol) {
            url += `&rol=${rol}`;
        }
        if (estado) {
            url += `&activo=${estado}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Error al cargar usuarios');
        }

        const data = await response.json();

        currentPage = data.number || 0;
        totalPages = data.totalPages || 1;

        renderUsuarios(data.content || []);
        actualizarPaginacion();

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('usuariosTableBody').innerHTML = `
            <tr>
                <td colspan="10" class="error-cell">Error al cargar usuarios. Verifique la conexión.</td>
            </tr>
        `;
    }
}

// === RENDERIZAR TABLA ===
function renderUsuarios(usuarios) {
    const tbody = document.getElementById('usuariosTableBody');

    if (!usuarios || usuarios.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="empty-cell">No se encontraron usuarios</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = usuarios.map(usuario => `
        <tr>
            <td>${usuario.id}</td>
            <td>${usuario.nombres} ${usuario.apellidos}</td>
            <td>${usuario.email}</td>
            <td>${usuario.documento}</td>
            <td>${usuario.telefono}</td>
            <td>${usuario.licencia}</td>
            <td><span class="badge badge-${usuario.rol.toLowerCase()}">${usuario.rol}</span></td>
            <td><span class="badge badge-${usuario.activo ? 'activo' : 'inactivo'}">${usuario.activo ? 'Activo' : 'Inactivo'}</span></td>
            <td>${formatearFecha(usuario.fechaRegistro)}</td>
            <td>
                <button class="btn-action" onclick="editarUsuario(${usuario.id})">Editar</button>
                <button class="btn-action delete" onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

// === PAGINACIÓN ===
function actualizarPaginacion() {
    document.getElementById('paginationInfo').textContent = `Página ${currentPage + 1} de ${totalPages}`;
    document.getElementById('btnPrevious').disabled = currentPage === 0;
    document.getElementById('btnNext').disabled = currentPage >= totalPages - 1;
}

document.getElementById('btnPrevious').addEventListener('click', () => {
    if (currentPage > 0) {
        cargarUsuarios(currentPage - 1);
    }
});

document.getElementById('btnNext').addEventListener('click', () => {
    if (currentPage < totalPages - 1) {
        cargarUsuarios(currentPage + 1);
    }
});

// === BÚSQUEDA Y FILTROS ===
let searchTimeout;
document.getElementById('searchUsuarios').addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        currentPage = 0;
        cargarUsuarios(0);
    }, 500);
});

document.getElementById('filterRol').addEventListener('change', () => {
    currentPage = 0;
    cargarUsuarios(0);
});

document.getElementById('filterEstado').addEventListener('change', () => {
    currentPage = 0;
    cargarUsuarios(0);
});

// === MODAL NUEVO USUARIO ===
function abrirModalNuevo() {
    document.getElementById('modalTitle').textContent = 'Nuevo Usuario';
    document.getElementById('formUsuario').reset();
    document.getElementById('usuarioId').value = '';
    document.getElementById('password').required = true;
    document.getElementById('passwordRequired').style.display = 'inline';
    document.getElementById('passwordHint').textContent = 'Mínimo 6 caracteres';
    document.getElementById('activo').checked = true;
    document.getElementById('modalUsuario').classList.add('show');
}

// === EDITAR USUARIO ===
async function editarUsuario(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        
        if (!response.ok) {
            throw new Error('Error al cargar usuario');
        }

        const usuario = await response.json();

        document.getElementById('modalTitle').textContent = 'Editar Usuario';
        document.getElementById('usuarioId').value = usuario.id;
        document.getElementById('nombres').value = usuario.nombres;
        document.getElementById('apellidos').value = usuario.apellidos;
        document.getElementById('documento').value = usuario.documento;
        document.getElementById('licencia').value = usuario.licencia;
        document.getElementById('telefono').value = usuario.telefono;
        document.getElementById('email').value = usuario.email;
        document.getElementById('rol').value = usuario.rol;
        document.getElementById('activo').checked = usuario.activo;
        document.getElementById('password').value = '';
        document.getElementById('password').required = false;
        document.getElementById('passwordRequired').style.display = 'none';
        document.getElementById('passwordHint').textContent = 'Dejar vacío para mantener la actual';

        document.getElementById('modalUsuario').classList.add('show');

    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar los datos del usuario');
    }
}

// === GUARDAR USUARIO (CREAR O ACTUALIZAR) ===
document.getElementById('formUsuario').addEventListener('submit', async (e) => {
    e.preventDefault();

    const usuarioId = document.getElementById('usuarioId').value;
    const password = document.getElementById('password').value;

    // Validar password solo si es nuevo usuario o si se ingresó una nueva contraseña
    if (!usuarioId && !password) {
        alert('La contraseña es obligatoria para nuevos usuarios');
        return;
    }

    const usuario = {
        nombres: document.getElementById('nombres').value,
        apellidos: document.getElementById('apellidos').value,
        documento: document.getElementById('documento').value,
        licencia: document.getElementById('licencia').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value,
        rol: document.getElementById('rol').value,
        activo: document.getElementById('activo').checked
    };

    // Solo incluir password si se ingresó
    if (password) {
        usuario.password = password;
    }

    try {
        let response;
        
        if (usuarioId) {
            // Actualizar usuario existente
            response = await fetch(`${API_URL}/${usuarioId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            });
        } else {
            // Crear nuevo usuario
            response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuario)
            });
        }

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Error al guardar usuario');
        }

        alert(usuarioId ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente');
        cerrarModal();
        cargarUsuarios(currentPage);

    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar usuario: ' + error.message);
    }
});

// === ELIMINAR USUARIO ===
function eliminarUsuario(id) {
    usuarioIdEliminar = id;
    document.getElementById('modalConfirmar').classList.add('show');
}

async function confirmarEliminar() {
    if (!usuarioIdEliminar) return;

    try {
        const response = await fetch(`${API_URL}/${usuarioIdEliminar}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error al eliminar usuario');
        }

        alert('Usuario eliminado exitosamente');
        cerrarModalConfirmar();
        cargarUsuarios(currentPage);

    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar usuario: ' + error.message);
    }
}

// === CERRAR MODALES ===
function cerrarModal() {
    document.getElementById('modalUsuario').classList.remove('show');
    document.getElementById('formUsuario').reset();
}

function cerrarModalConfirmar() {
    document.getElementById('modalConfirmar').classList.remove('show');
    usuarioIdEliminar = null;
}

// Cerrar modales al hacer clic fuera
window.onclick = function(event) {
    const modalUsuario = document.getElementById('modalUsuario');
    const modalConfirmar = document.getElementById('modalConfirmar');
    
    if (event.target === modalUsuario) {
        cerrarModal();
    }
    if (event.target === modalConfirmar) {
        cerrarModalConfirmar();
    }
}

// === FORMATEAR FECHA ===
function formatearFecha(fechaString) {
    const fecha = new Date(fechaString);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
}

// === INICIALIZAR ===
document.addEventListener('DOMContentLoaded', () => {
    cargarUsuarios();
});