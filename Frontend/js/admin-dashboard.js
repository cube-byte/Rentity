// Configuración de la API
const API_URL = 'http://localhost:9090/api/admin';
let currentPage = 0;
const pageSize = 10;
let totalPages = 1;

// === CARGAR ESTADÍSTICAS DEL DASHBOARD ===
async function cargarEstadisticas() {
    try {
        const response = await fetch(`${API_URL}/dashboard`);
        
        if (!response.ok) {
            throw new Error('Error al obtener datos del servidor');
        }
        
        const data = await response.json();
        
        // Actualizar tarjetas
        document.getElementById('totalAutos').textContent = data.totalAutos || 0;
        document.getElementById('totalReservas').textContent = data.reservasActivas || 0;
        document.getElementById('totalUsuarios').textContent = data.totalUsuarios || 0;
        document.getElementById('totalPagos').textContent = data.ingresosMes 
            ? `$${data.ingresosMes.toLocaleString()}` 
            : '$0';
        
    } catch (error) {
        console.error('Error al cargar estadísticas:', error);
    }
}

// === CARGAR LISTA DE USUARIOS ===
async function cargarUsuarios(page = 0, search = '') {
    try {
        let url = `${API_URL}/usuarios?page=${page}&size=${pageSize}`;
        if (search) {
            url += `&search=${encodeURIComponent(search)}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Error al obtener usuarios');
        }
        
        const data = await response.json();
        
        // Actualizar variables de paginación
        currentPage = data.number || 0;
        totalPages = data.totalPages || 1;
        
        // Renderizar tabla
        renderUsuarios(data.content || []);
        
        // Actualizar paginación
        actualizarPaginacion();
        
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        document.getElementById('usuariosTableBody').innerHTML = `
            <tr>
                <td colspan="8" class="error-cell">Error al cargar usuarios. Verifique la conexión.</td>
            </tr>
        `;
    }
}

// === RENDERIZAR USUARIOS EN LA TABLA ===
function renderUsuarios(usuarios) {
    const tbody = document.getElementById('usuariosTableBody');
    
    if (!usuarios || usuarios.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-cell">No se encontraron usuarios</td>
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
            <td><span class="badge badge-${usuario.rol.toLowerCase()}">${usuario.rol}</span></td>
            <td><span class="badge badge-${usuario.activo ? 'activo' : 'inactivo'}">${usuario.activo ? 'Activo' : 'Inactivo'}</span></td>
            <td>${formatearFecha(usuario.fechaRegistro)}</td>
        </tr>
    `).join('');
}

// === ACTUALIZAR PAGINACIÓN ===
function actualizarPaginacion() {
    document.getElementById('paginationInfo').textContent = `Página ${currentPage + 1} de ${totalPages}`;
    
    // Habilitar/deshabilitar botones
    document.getElementById('btnPrevious').disabled = currentPage === 0;
    document.getElementById('btnNext').disabled = currentPage >= totalPages - 1;
}

// === FORMATEAR FECHA ===
function formatearFecha(fechaString) {
    const fecha = new Date(fechaString);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
}

// === BÚSQUEDA ===
let searchTimeout;
document.getElementById('searchUsuarios').addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        currentPage = 0;
        cargarUsuarios(0, e.target.value);
    }, 500);
});

// === EVENTOS DE PAGINACIÓN ===
document.getElementById('btnPrevious').addEventListener('click', () => {
    if (currentPage > 0) {
        const search = document.getElementById('searchUsuarios').value;
        cargarUsuarios(currentPage - 1, search);
    }
});

document.getElementById('btnNext').addEventListener('click', () => {
    if (currentPage < totalPages - 1) {
        const search = document.getElementById('searchUsuarios').value;
        cargarUsuarios(currentPage + 1, search);
    }
});

// === INICIALIZAR AL CARGAR LA PÁGINA ===
document.addEventListener('DOMContentLoaded', () => {
    cargarEstadisticas();
    cargarUsuarios();
    
    // Actualizar estadísticas cada 30 segundos
    setInterval(cargarEstadisticas, 30000);
});

        // ─── Cerrar sesión ────────────────────────────────────────────────────────────
        document.getElementById('btn-cerrar-sesion').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('rentify_usuario'); // Borra la sesión guardada
            window.location.href = '../../html/login.html'; // Regresa al login
        });
