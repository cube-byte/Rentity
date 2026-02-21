// ══════════════════════════════════════════════
//  admin-usuarios.js  –  Rentify Admin
// ══════════════════════════════════════════════

const API_URL = 'http://localhost:9090/api/admin/usuarios';
let currentPage = 0;
const pageSize = 10;
let totalPages = 1;
let usuarioIdAccion = null;       // ← renombrado
let usuarioActivoActual = false;  // ← nuevo: guarda el estado actual del usuario

// ── HELPERS DE VALIDACIÓN INLINE ─────────────

function mostrarError(id, mensaje) {
    const input = document.getElementById(id);
    if (!input) return;
    input.classList.add('input-error');
    input.classList.remove('input-ok');

    let err = input.parentElement.querySelector('.field-error');
    if (!err) {
        err = document.createElement('span');
        err.className = 'field-error';
        const hint = input.parentElement.querySelector('.form-hint');
        if (hint) {
            input.parentElement.insertBefore(err, hint);
        } else {
            input.parentElement.appendChild(err);
        }
    }
    err.textContent = mensaje;
}

function limpiarError(id) {
    const input = document.getElementById(id);
    if (!input) return;
    input.classList.remove('input-error');
    input.classList.add('input-ok');
    const err = input.parentElement.querySelector('.field-error');
    if (err) err.remove();
}

function limpiarTodosLosErrores() {
    document.querySelectorAll('.input-error').forEach(el => {
        el.classList.remove('input-error');
        el.classList.add('input-ok');
    });
    document.querySelectorAll('.field-error').forEach(el => el.remove());
}

function agregarLimpiezaAutomatica() {
    ['nombres','apellidos','documento','licencia','telefono','email','password','rol'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input',  () => limpiarError(id));
        el.addEventListener('change', () => limpiarError(id));
    });
}

// ── VALIDAR FORMULARIO ────────────────────────
function validarFormulario() {
    let valido = true;
    const usuarioId = document.getElementById('usuarioId').value;

    const nombres = document.getElementById('nombres').value.trim();
    if (!nombres) {
        mostrarError('nombres', 'El nombre es obligatorio');
        valido = false;
    }

    const apellidos = document.getElementById('apellidos').value.trim();
    if (!apellidos) {
        mostrarError('apellidos', 'Los apellidos son obligatorios');
        valido = false;
    }

    const documento = document.getElementById('documento').value.trim();
    if (!documento) {
        mostrarError('documento', 'El documento es obligatorio');
        valido = false;
    } else if (!/^[0-9]{8,12}$/.test(documento)) {
        mostrarError('documento', 'Debe tener entre 8 y 12 dígitos numéricos');
        valido = false;
    }

    const licencia = document.getElementById('licencia').value.trim();
    if (!licencia) {
        mostrarError('licencia', 'La licencia es obligatoria');
        valido = false;
    }

    const telefono = document.getElementById('telefono').value.trim();
    if (!telefono) {
        mostrarError('telefono', 'El teléfono es obligatorio');
        valido = false;
    } else if (!/^[0-9]{9}$/.test(telefono)) {
        mostrarError('telefono', 'Debe tener exactamente 9 dígitos');
        valido = false;
    }

    const email = document.getElementById('email').value.trim();
    if (!email) {
        mostrarError('email', 'El email es obligatorio');
        valido = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        mostrarError('email', 'Ingresa un email válido');
        valido = false;
    }

    const password = document.getElementById('password').value;
    if (!usuarioId && !password) {
        mostrarError('password', 'La contraseña es obligatoria para nuevos usuarios');
        valido = false;
    } else if (password && password.length < 6) {
        mostrarError('password', 'La contraseña debe tener al menos 6 caracteres');
        valido = false;
    }

    const rol = document.getElementById('rol').value;
    if (!rol) {
        mostrarError('rol', 'Selecciona un rol');
        valido = false;
    }

    return valido;
}

// ── CARGAR USUARIOS ───────────────────────────
async function cargarUsuarios(page = 0) {
    try {
        const search = document.getElementById('searchUsuarios').value;
        const rol    = document.getElementById('filterRol').value;
        const estado = document.getElementById('filterEstado').value;

        let url = `${API_URL}?page=${page}&size=${pageSize}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (rol)    url += `&rol=${rol}`;
        if (estado) url += `&activo=${estado}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al cargar usuarios');

        const data  = await response.json();
        currentPage = data.number     || 0;
        totalPages  = data.totalPages || 1;

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

// ── RENDERIZAR TABLA ──────────────────────────
function renderUsuarios(usuarios) {
    const tbody = document.getElementById('usuariosTableBody');

    if (!usuarios || usuarios.length === 0) {
        tbody.innerHTML = `
            <tr><td colspan="10" class="empty-cell">No se encontraron usuarios</td></tr>
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
                <button class="btn-action ${usuario.activo ? 'delete' : 'enable'}"
                        onclick="toggleEstadoUsuario(${usuario.id}, ${usuario.activo})">
                    ${usuario.activo ? 'Deshabilitar' : 'Habilitar'}
                </button>
            </td>
        </tr>
    `).join('');
}

// ── PAGINACIÓN ────────────────────────────────
function actualizarPaginacion() {
    document.getElementById('paginationInfo').textContent = `Página ${currentPage + 1} de ${totalPages}`;
    document.getElementById('btnPrevious').disabled = currentPage === 0;
    document.getElementById('btnNext').disabled     = currentPage >= totalPages - 1;
}

document.getElementById('btnPrevious').addEventListener('click', () => {
    if (currentPage > 0) cargarUsuarios(currentPage - 1);
});

document.getElementById('btnNext').addEventListener('click', () => {
    if (currentPage < totalPages - 1) cargarUsuarios(currentPage + 1);
});

// ── BÚSQUEDA Y FILTROS ────────────────────────
let searchTimeout;
document.getElementById('searchUsuarios').addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => { currentPage = 0; cargarUsuarios(0); }, 500);
});

document.getElementById('filterRol').addEventListener('change', () => { currentPage = 0; cargarUsuarios(0); });
document.getElementById('filterEstado').addEventListener('change', () => { currentPage = 0; cargarUsuarios(0); });

// ── MODAL NUEVO USUARIO ───────────────────────
function abrirModalNuevo() {
    document.getElementById('modalTitle').textContent = 'Nuevo Usuario';
    document.getElementById('formUsuario').reset();
    document.getElementById('usuarioId').value = '';
    document.getElementById('password').required = true;
    document.getElementById('passwordRequired').style.display = 'inline';
    document.getElementById('passwordHint').textContent = 'Mínimo 6 caracteres';
    document.getElementById('activo').checked = true;
    limpiarTodosLosErrores();
    document.getElementById('modalUsuario').classList.add('show');
}

// ── EDITAR USUARIO ────────────────────────────
async function editarUsuario(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Error al cargar usuario');

        const usuario = await response.json();

        document.getElementById('modalTitle').textContent = 'Editar Usuario';
        document.getElementById('usuarioId').value    = usuario.id;
        document.getElementById('nombres').value      = usuario.nombres;
        document.getElementById('apellidos').value    = usuario.apellidos;
        document.getElementById('documento').value    = usuario.documento;
        document.getElementById('licencia').value     = usuario.licencia;
        document.getElementById('telefono').value     = usuario.telefono;
        document.getElementById('email').value        = usuario.email;
        document.getElementById('rol').value          = usuario.rol;
        document.getElementById('activo').checked     = usuario.activo;
        document.getElementById('password').value     = '';
        document.getElementById('password').required  = false;
        document.getElementById('passwordRequired').style.display = 'none';
        document.getElementById('passwordHint').textContent = 'Dejar vacío para mantener la actual';

        limpiarTodosLosErrores();
        document.getElementById('modalUsuario').classList.add('show');

    } catch (error) {
        console.error('Error:', error);
        mostrarMensajeTabla('No se pudieron cargar los datos del usuario');
    }
}

// ── GUARDAR USUARIO ───────────────────────────
document.getElementById('formUsuario').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    const usuarioId = document.getElementById('usuarioId').value;
    const password  = document.getElementById('password').value;

    const usuario = {
        nombres:   document.getElementById('nombres').value.trim(),
        apellidos: document.getElementById('apellidos').value.trim(),
        documento: document.getElementById('documento').value.trim(),
        licencia:  document.getElementById('licencia').value.trim(),
        telefono:  document.getElementById('telefono').value.trim(),
        email:     document.getElementById('email').value.trim(),
        rol:       document.getElementById('rol').value,
        activo:    document.getElementById('activo').checked
    };

    if (password) usuario.password = password;

    try {
        const response = usuarioId
            ? await fetch(`${API_URL}/${usuarioId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuario)
              })
            : await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuario)
              });

        if (!response.ok) {
            const errorTexto = await response.text();
            mostrarError('email', errorTexto || 'Error al guardar el usuario');
            return;
        }

        cerrarModal();
        cargarUsuarios(currentPage);
        mostrarBannerExito(usuarioId ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente');

    } catch (error) {
        console.error('Error:', error);
        mostrarError('email', 'Error de conexión. Intenta nuevamente.');
    }
});

// ── TOGGLE ESTADO USUARIO (Habilitar / Deshabilitar) ──
function toggleEstadoUsuario(id, activo) {
    usuarioIdAccion      = id;
    usuarioActivoActual  = activo;

    const titulo = activo ? 'Deshabilitar Usuario' : 'Habilitar Usuario';
    const texto  = activo
        ? '¿Estás seguro de que deseas deshabilitar este usuario? No podrá iniciar sesión.'
        : '¿Estás seguro de que deseas habilitar este usuario? Recuperará acceso al sistema.';

    document.getElementById('modalConfirmarTitulo').textContent = titulo;
    document.getElementById('modalConfirmarTexto').textContent  = texto;
    document.getElementById('btnConfirmarAccion').textContent   = activo ? 'Deshabilitar' : 'Habilitar';
    document.getElementById('btnConfirmarAccion').className     = activo ? 'btn-danger' : 'btn-primary';

    document.getElementById('modalConfirmar').classList.add('show');
}

async function confirmarEliminar() {
    if (!usuarioIdAccion) return;

    const endpoint = usuarioActivoActual
        ? `${API_URL}/${usuarioIdAccion}/desactivar`
        : `${API_URL}/${usuarioIdAccion}/activar`;

    try {
        const response = await fetch(endpoint, { method: 'PUT' });
        if (!response.ok) throw new Error('Error al cambiar estado');

        cerrarModalConfirmar();
        cargarUsuarios(currentPage);
        mostrarBannerExito(usuarioActivoActual
            ? 'Usuario deshabilitado correctamente'
            : 'Usuario habilitado correctamente');

    } catch (error) {
        console.error('Error:', error);
        const modalBody = document.querySelector('#modalConfirmar .modal-body');
        let err = modalBody.querySelector('.field-error');
        if (!err) {
            err = document.createElement('span');
            err.className = 'field-error';
            modalBody.appendChild(err);
        }
        err.textContent = 'No se pudo cambiar el estado. Intenta nuevamente.';
    }
}

// ── BANNER DE ÉXITO ───────────────────────────
function mostrarBannerExito(mensaje) {
    let banner = document.getElementById('banner-exito');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'banner-exito';
        banner.style.cssText = `
            background: #e8f5e9;
            border-left: 4px solid #22a34d;
            color: #1b5e20;
            padding: 10px 16px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            margin-bottom: 16px;
        `;
        const filtros = document.querySelector('.filters-section');
        filtros.parentElement.insertBefore(banner, filtros);
    }
    banner.textContent = `✓  ${mensaje}`;
    banner.style.display = 'block';
    setTimeout(() => { banner.style.display = 'none'; }, 3500);
}

function mostrarMensajeTabla(mensaje) {
    document.getElementById('usuariosTableBody').innerHTML = `
        <tr><td colspan="10" class="error-cell">${mensaje}</td></tr>
    `;
}

// ── CERRAR MODALES ────────────────────────────
function cerrarModal() {
    document.getElementById('modalUsuario').classList.remove('show');
    document.getElementById('formUsuario').reset();
    limpiarTodosLosErrores();
}

function cerrarModalConfirmar() {
    document.getElementById('modalConfirmar').classList.remove('show');
    const err = document.querySelector('#modalConfirmar .field-error');
    if (err) err.remove();
    usuarioIdAccion     = null;   // ← renombrado
    usuarioActivoActual = false;  // ← reset
}

window.onclick = function(event) {
    if (event.target === document.getElementById('modalUsuario'))   cerrarModal();
    if (event.target === document.getElementById('modalConfirmar')) cerrarModalConfirmar();
};

// ── FORMATEAR FECHA ───────────────────────────
function formatearFecha(fechaString) {
    const fecha = new Date(fechaString);
    const dia   = fecha.getDate().toString().padStart(2, '0');
    const mes   = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio  = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
}

// ── INICIALIZAR ───────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    cargarUsuarios();
    agregarLimpiezaAutomatica();
});

// ── CERRAR SESIÓN ─────────────────────────────
document.getElementById('btn-cerrar-sesion').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('rentify_usuario');
    window.location.href = '../../html/login.html';
});

// ── PERFIL ────────────────────────────────────
const _u = JSON.parse(localStorage.getItem('rentify_usuario') || '{}');
if (_u.email) document.getElementById('perfilEmail').textContent = _u.email;
if (_u.rol)   document.getElementById('perfilRol').textContent   = _u.rol;