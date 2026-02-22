// ═══════════════════════════════════════════════════════
//  admin-dashboard.js  –  Rentify Admin
// ═══════════════════════════════════════════════════════

const API_URL       = 'http://localhost:9090/api/admin';
const API_VEHICULOS = 'http://localhost:9090/api/v12/vehiculos';
const API_AUTOS     = 'http://localhost:9090/api/v12/autos';
const API_RESERVAS  = 'http://localhost:9090/api/admin/reservas';

let currentPage = 0;
const pageSize  = 10;
let totalPages  = 1;

// ── HELPERS ──────────────────────────────────────────────
function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function formatearFecha(fechaString) {
    const fecha = new Date(fechaString);
    const dia   = fecha.getDate().toString().padStart(2, '0');
    const mes   = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio  = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
}

// ── ESTADÍSTICAS ADMIN (usuarios e ingresos) ─────────────
async function cargarEstadisticasAdmin() {
    try {
        const res = await fetch(`${API_URL}/dashboard`);
        if (!res.ok) return;
        const data = await res.json();

        setText('totalUsuarios', data.totalUsuarios ?? 0);
        setText('totalPagos',
            data.ingresosMes != null
                ? `$${data.ingresosMes.toLocaleString()}`
                : '$0'
        );
    } catch (err) {
        console.error('Error estadísticas:', err);
    }
}

// ── CONTADORES RESERVAS ───────────────────────────────────
async function cargarContadoresReservas() {
    try {
        const res = await fetch('http://localhost:9090/api/v12/reservas');
        if (!res.ok) throw new Error('Error');

        const reservas = await res.json();

        const activas = reservas.filter(r =>
            ['NUEVA', 'CONFIRMADA', 'REALIZADA'].includes(r.estado)
        ).length;

        setText('totalReservas', activas);

    } catch (err) {
        console.error('Error reservas:', err);
        setText('totalReservas', 0);
    }
}

// ── CONTADORES FLOTA (vehículos y autos) ─────────────────
async function cargarContadoresFlota() {
    try {
        const [resV, resA] = await Promise.all([
            fetch(API_VEHICULOS),
            fetch(API_AUTOS)
        ]);

        if (resV.ok) {
            const vehiculos = await resV.json();
            setText('totalVehiculos', vehiculos.length ?? 0);
        }

        if (resA.ok) {
            const autos = await resA.json();
            setText('totalAutos', autos.length ?? 0);
            const disponibles = autos.filter(a => a.estado === 'DISPONIBLE').length;
            setText('totalDisponibles', disponibles);
        }
    } catch (err) {
        console.error('Error flota:', err);
    }
}

// ── TABLA USUARIOS ────────────────────────────────────────
async function cargarUsuarios(page = 0, search = '') {
    try {
        let url = `${API_URL}/usuarios?page=${page}&size=${pageSize}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error('Error al obtener usuarios');

        const data  = await res.json();
        currentPage = data.number     ?? 0;
        totalPages  = data.totalPages ?? 1;

        renderUsuarios(data.content ?? []);
        actualizarPaginacion();

    } catch (err) {
        console.error('Error usuarios:', err);
        document.getElementById('usuariosTableBody').innerHTML = `
            <tr><td colspan="8" class="error-cell">Error al cargar usuarios. Verifique la conexión.</td></tr>
        `;
    }
}

function renderUsuarios(usuarios) {
    const tbody = document.getElementById('usuariosTableBody');

    if (!usuarios || usuarios.length === 0) {
        tbody.innerHTML = `<tr><td colspan="8" class="empty-cell">No se encontraron usuarios</td></tr>`;
        return;
    }

    tbody.innerHTML = usuarios.map(u => `
        <tr>
            <td>${u.id}</td>
            <td>${u.nombres} ${u.apellidos}</td>
            <td>${u.email}</td>
            <td>${u.documento}</td>
            <td>${u.telefono}</td>
            <td><span class="badge badge-${u.rol.toLowerCase()}">${u.rol}</span></td>
            <td><span class="badge badge-${u.activo ? 'activo' : 'inactivo'}">${u.activo ? 'Activo' : 'Inactivo'}</span></td>
            <td>${formatearFecha(u.fechaRegistro)}</td>
        </tr>
    `).join('');
}

function actualizarPaginacion() {
    setText('paginationInfo', `Página ${currentPage + 1} de ${totalPages}`);
    document.getElementById('btnPrevious').disabled = currentPage === 0;
    document.getElementById('btnNext').disabled     = currentPage >= totalPages - 1;
}

// ── BÚSQUEDA ──────────────────────────────────────────────
let searchTimeout;
document.getElementById('searchUsuarios').addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        currentPage = 0;
        cargarUsuarios(0, e.target.value);
    }, 500);
});

// ── PAGINACIÓN ────────────────────────────────────────────
document.getElementById('btnPrevious').addEventListener('click', () => {
    if (currentPage > 0) {
        cargarUsuarios(currentPage - 1, document.getElementById('searchUsuarios').value);
    }
});

document.getElementById('btnNext').addEventListener('click', () => {
    if (currentPage < totalPages - 1) {
        cargarUsuarios(currentPage + 1, document.getElementById('searchUsuarios').value);
    }
});

// ── CERRAR SESIÓN ─────────────────────────────────────────
document.getElementById('btn-cerrar-sesion').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('rentify_usuario');
    window.location.href = '../../html/login.html';
});

// ── PERFIL DESDE LOCALSTORAGE ─────────────────────────────
function cargarPerfil() {
    const usuario = JSON.parse(localStorage.getItem('rentify_usuario') || '{}');
    if (usuario.email) setText('perfilEmail', usuario.email);
    if (usuario.rol)   setText('perfilRol',   usuario.rol);
}

// ── INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    cargarPerfil();
    cargarEstadisticasAdmin();
    cargarContadoresFlota();
    cargarContadoresReservas();   // ← nuevo
    cargarUsuarios();

    // Refresco automático cada 30 s
    setInterval(() => {
        cargarEstadisticasAdmin();
        cargarContadoresFlota();
        cargarContadoresReservas();   // ← nuevo
    }, 30_000);
});