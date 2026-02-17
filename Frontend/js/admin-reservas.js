// Configuración de la API
const API_URL = 'http://localhost:9090/api/admin/reservas';
let currentPage = 0;
const pageSize = 10;
let totalPages = 1;
let reservaSeleccionada = null;
let accionPendiente = null;

// === DATOS DE EJEMPLO (MOCK DATA) ===
// Esto se usará mientras no haya backend
const MOCK_DATA = {
    content: [
        {
            id: 1,
            nombres: "Juan Pérez",
            email: "juan@example.com",
            telefono: "987654321",
            dni: "12345678",
            auto: {
                id: 1,
                marca: "Toyota",
                modelo: "Corolla",
                anio: 2023
            },
            fecha_inicio: "2026-02-20T10:00:00",
            fecha_fin: "2026-02-25T10:00:00",
            precio_total: 450.00,
            fecha: "2026-02-16T14:30:00",
            estado: "PENDIENTE"
        },
        {
            id: 2,
            nombres: "María García",
            email: "maria@example.com",
            telefono: "912345678",
            dni: "87654321",
            auto: {
                id: 2,
                marca: "Honda",
                modelo: "Civic",
                anio: 2024
            },
            fecha_inicio: "2026-02-18T09:00:00",
            fecha_fin: "2026-02-22T09:00:00",
            precio_total: 380.00,
            fecha: "2026-02-15T10:20:00",
            estado: "APROBADA"
        },
        {
            id: 3,
            nombres: "Carlos López",
            email: "carlos@example.com",
            telefono: "998877665",
            dni: "11223344",
            auto: {
                id: 3,
                marca: "Mazda",
                modelo: "CX-5",
                anio: 2023
            },
            fecha_inicio: "2026-02-17T08:00:00",
            fecha_fin: "2026-02-20T08:00:00",
            precio_total: 320.00,
            fecha: "2026-02-14T16:45:00",
            estado: "EN_CURSO"
        },
        {
            id: 4,
            nombres: "Ana Martínez",
            email: "ana@example.com",
            telefono: "955443322",
            dni: "55667788",
            auto: {
                id: 4,
                marca: "Nissan",
                modelo: "Sentra",
                anio: 2022
            },
            fecha_inicio: "2026-02-10T10:00:00",
            fecha_fin: "2026-02-14T10:00:00",
            precio_total: 280.00,
            fecha: "2026-02-08T11:15:00",
            estado: "COMPLETADA"
        },
        {
            id: 5,
            nombres: "Luis Rodríguez",
            email: "luis@example.com",
            telefono: "966554433",
            dni: "99887766",
            auto: {
                id: 5,
                marca: "Hyundai",
                modelo: "Tucson",
                anio: 2024
            },
            fecha_inicio: "2026-02-22T11:00:00",
            fecha_fin: "2026-02-26T11:00:00",
            precio_total: 400.00,
            fecha: "2026-02-16T09:00:00",
            estado: "CANCELADA"
        }
    ],
    totalPages: 1,
    totalElements: 5,
    number: 0
};

// === CARGAR RESERVAS ===
async function cargarReservas(page = 0) {
    try {
        const search = document.getElementById('searchReservas').value;
        const estado = document.getElementById('filterEstado').value;
        const fechaInicio = document.getElementById('filterFechaInicio').value;
        const fechaFin = document.getElementById('filterFechaFin').value;

        // COMENTAR ESTO CUANDO TENGAS EL BACKEND
        // Por ahora usamos datos de ejemplo
        const data = filtrarMockData(search, estado, fechaInicio, fechaFin);
        
        /* DESCOMENTAR ESTO CUANDO TENGAS EL BACKEND
        let url = `${API_URL}?page=${page}&size=${pageSize}`;
        
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (estado) url += `&estado=${estado}`;
        if (fechaInicio) url += `&fechaInicio=${fechaInicio}`;
        if (fechaFin) url += `&fechaFin=${fechaFin}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al cargar reservas');
        const data = await response.json();
        */

        currentPage = data.number || 0;
        totalPages = data.totalPages || 1;

        renderReservas(data.content || []);
        actualizarPaginacion();

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('reservasTableBody').innerHTML = `
            <tr>
                <td colspan="10" class="error-cell">Error al cargar reservas. Usando datos de ejemplo.</td>
            </tr>
        `;
    }
}

// === FILTRAR MOCK DATA ===
function filtrarMockData(search, estado, fechaInicio, fechaFin) {
    let filtered = [...MOCK_DATA.content];

    if (search) {
        search = search.toLowerCase();
        filtered = filtered.filter(r => 
            r.nombres.toLowerCase().includes(search) ||
            r.email.toLowerCase().includes(search) ||
            r.dni.includes(search)
        );
    }

    if (estado) {
        filtered = filtered.filter(r => r.estado === estado);
    }

    return {
        content: filtered,
        totalPages: 1,
        totalElements: filtered.length,
        number: 0
    };
}

// === RENDERIZAR TABLA ===
function renderReservas(reservas) {
    const tbody = document.getElementById('reservasTableBody');

    if (!reservas || reservas.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="empty-cell">No se encontraron reservas</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = reservas.map(reserva => `
        <tr>
            <td>${reserva.id}</td>
            <td>${reserva.nombres}</td>
            <td>${reserva.telefono}</td>
            <td>${reserva.dni}</td>
            <td>${reserva.auto ? `${reserva.auto.marca} ${reserva.auto.modelo}` : 'N/A'}</td>
            <td>${formatearFecha(reserva.fecha_inicio)}</td>
            <td>${formatearFecha(reserva.fecha_fin)}</td>
            <td style="color: #aace69; font-weight: 600;">$${Number(reserva.precio_total).toFixed(2)}</td>
            <td><span class="badge badge-${reserva.estado.toLowerCase()}">${formatearEstado(reserva.estado)}</span></td>
            <td>
                <button class="btn-action" onclick="verDetalles(${reserva.id})">Ver Detalles</button>
                <button class="btn-action delete" onclick="eliminarReserva(${reserva.id})">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

// === VER DETALLES ===
function verDetalles(id) {
    // Buscar la reserva en los datos
    const reserva = MOCK_DATA.content.find(r => r.id === id);
    
    if (!reserva) return;

    reservaSeleccionada = reserva;

    // Llenar los detalles
    document.getElementById('detalle-id').textContent = reserva.id;
    document.getElementById('detalle-cliente').textContent = reserva.nombres;
    document.getElementById('detalle-email').textContent = reserva.email;
    document.getElementById('detalle-telefono').textContent = reserva.telefono;
    document.getElementById('detalle-dni').textContent = reserva.dni;
    document.getElementById('detalle-auto').textContent = `${reserva.auto.marca} ${reserva.auto.modelo} ${reserva.auto.anio}`;
    document.getElementById('detalle-fecha-inicio').textContent = formatearFechaCompleta(reserva.fecha_inicio);
    document.getElementById('detalle-fecha-fin').textContent = formatearFechaCompleta(reserva.fecha_fin);
    
    const dias = calcularDias(reserva.fecha_inicio, reserva.fecha_fin);
    document.getElementById('detalle-dias').textContent = `${dias} días`;
    
    document.getElementById('detalle-precio').textContent = `$${Number(reserva.precio_total).toFixed(2)}`;
    document.getElementById('detalle-estado').innerHTML = `<span class="badge badge-${reserva.estado.toLowerCase()}">${formatearEstado(reserva.estado)}</span>`;
    document.getElementById('detalle-fecha-reserva').textContent = formatearFechaCompleta(reserva.fecha);

    // Abrir modal
    document.getElementById('modalDetalles').classList.add('show');
}

// Eliminar la función mostrarAcciones ya que no la necesitamos

// === ELIMINAR RESERVA ===
let reservaIdEliminar = null;

function eliminarReserva(id) {
    reservaIdEliminar = id;
    document.getElementById('confirmarTitle').textContent = 'Confirmar Eliminación';
    document.getElementById('confirmarMensaje').textContent = '¿Estás seguro de que deseas eliminar esta reserva?';
    document.getElementById('modalConfirmar').classList.add('show');
}

// === CONFIRMAR ELIMINACIÓN ===
async function confirmarEliminacion() {
    if (!reservaIdEliminar) return;
    
    try {
        /* DESCOMENTAR CUANDO TENGAS EL BACKEND
        const response = await fetch(`${API_URL}/${reservaIdEliminar}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Error al eliminar reserva');
        */
        
        // Simular eliminación en datos locales
        const index = MOCK_DATA.content.findIndex(r => r.id === reservaIdEliminar);
        if (index !== -1) {
            MOCK_DATA.content.splice(index, 1);
        }
        
        alert('Reserva eliminada exitosamente');
        cerrarModalConfirmar();
        cargarReservas(currentPage);
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar reserva: ' + error.message);
    }
}

// === CONFIRMAR ACCIÓN ===
document.getElementById('btnConfirmarAccion').addEventListener('click', async () => {
    // Si es una eliminación
    if (reservaIdEliminar) {
        await confirmarEliminacion();
        reservaIdEliminar = null;
        return;
    }
    
    // Si es un cambio de estado
    if (!reservaSeleccionada || !accionPendiente) return;
    
    try {
        /* DESCOMENTAR CUANDO TENGAS EL BACKEND
        const response = await fetch(`${API_URL}/${reservaSeleccionada.id}/estado`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: accionPendiente })
        });
        
        if (!response.ok) throw new Error('Error al cambiar estado');
        */
        
        // Simular cambio de estado en datos locales
        const index = MOCK_DATA.content.findIndex(r => r.id === reservaSeleccionada.id);
        if (index !== -1) {
            MOCK_DATA.content[index].estado = accionPendiente;
        }
        
        alert('Estado actualizado exitosamente');
        cerrarModalConfirmar();
        cerrarModalDetalles();
        cargarReservas(currentPage);
        
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cambiar el estado: ' + error.message);
    }
});

// === CERRAR MODALES ===
function cerrarModalDetalles() {
    document.getElementById('modalDetalles').classList.remove('show');
    reservaSeleccionada = null;
}

function cerrarModalConfirmar() {
    document.getElementById('modalConfirmar').classList.remove('show');
    accionPendiente = null;
    reservaIdEliminar = null;
}

// === PAGINACIÓN ===
function actualizarPaginacion() {
    document.getElementById('paginationInfo').textContent = `Página ${currentPage + 1} de ${totalPages}`;
    document.getElementById('btnPrevious').disabled = currentPage === 0;
    document.getElementById('btnNext').disabled = currentPage >= totalPages - 1;
}

document.getElementById('btnPrevious').addEventListener('click', () => {
    if (currentPage > 0) cargarReservas(currentPage - 1);
});

document.getElementById('btnNext').addEventListener('click', () => {
    if (currentPage < totalPages - 1) cargarReservas(currentPage + 1);
});

// === FILTROS ===
let searchTimeout;
document.getElementById('searchReservas').addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        currentPage = 0;
        cargarReservas(0);
    }, 500);
});

document.getElementById('filterEstado').addEventListener('change', () => {
    currentPage = 0;
    cargarReservas(0);
});

document.getElementById('filterFechaInicio').addEventListener('change', () => {
    currentPage = 0;
    cargarReservas(0);
});

document.getElementById('filterFechaFin').addEventListener('change', () => {
    currentPage = 0;
    cargarReservas(0);
});

// === UTILIDADES ===
function formatearFecha(fechaString) {
    if (!fechaString) return 'N/A';
    const fecha = new Date(fechaString);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
}

function formatearFechaCompleta(fechaString) {
    if (!fechaString) return 'N/A';
    const fecha = new Date(fechaString);
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    const hora = fecha.getHours().toString().padStart(2, '0');
    const min = fecha.getMinutes().toString().padStart(2, '0');
    return `${dia}/${mes}/${anio} ${hora}:${min}`;
}

function formatearEstado(estado) {
    const estados = {
        'PENDIENTE': 'Pendiente',
        'APROBADA': 'Aprobada',
        'EN_CURSO': 'En Curso',
        'COMPLETADA': 'Completada',
        'CANCELADA': 'Cancelada'
    };
    return estados[estado] || estado;
}

function calcularDias(inicio, fin) {
    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);
    const diferencia = fechaFin - fechaInicio;
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
}

// Cerrar modales al hacer clic fuera
window.onclick = function(event) {
    const modalDetalles = document.getElementById('modalDetalles');
    const modalConfirmar = document.getElementById('modalConfirmar');
    
    if (event.target === modalDetalles) cerrarModalDetalles();
    if (event.target === modalConfirmar) cerrarModalConfirmar();
}

// === INICIALIZAR ===
document.addEventListener('DOMContentLoaded', () => {
    cargarReservas();
});