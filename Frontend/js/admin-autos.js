// Configuración de la API
const API_URL = 'http://localhost:8080/api/admin/autos';

let autoIdEliminar = null;

// ================= CARGAR AUTOS =================
async function cargarAutos() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Error al cargar autos');
        }

        const autos = await response.json();
        renderAutos(autos);

    } catch (error) {
        console.error(error);
        document.getElementById('autosTableBody').innerHTML = `
            <tr>
                <td colspan="13">Error al cargar autos</td>
            </tr>
        `;
    }
}

// ================= RENDER TABLA =================
function renderAutos(autos) {
    const tbody = document.getElementById('autosTableBody');

    if (!autos || autos.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="13">No hay autos registrados</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = autos.map(auto => `
        <tr>
            <td>${auto.vehiculo}</td>
            <td>${auto.marca}</td>
            <td>${auto.model}</td>
            <td>${auto.version}</td>
            <td>${auto.year}</td>
            <td>${auto.categoria}</td>
            <td>${auto.carroceria}</td>
            <td>${auto.combustible}</td>
            <td>${auto.descripcion}</td>
            <td>${auto.precio}</td>
            <td>${auto.estado}</td>
            <td>${auto.imagen}</td>
            <td>
                <button class="btn-action" onclick="editarAuto(${auto.vehiculo})">Editar</button>
                <button class="btn-action delete" onclick="eliminarAuto(${auto.vehiculo})">Eliminar</button>
            </td>
        </tr>
    `).join('');
}

// ================= ABRIR MODAL NUEVO =================
function abrirModalNuevo() {
    document.getElementById('modalTitle').textContent = 'Nuevo Auto';
    document.getElementById('formAuto').reset();
    document.getElementById('autoId').value = '';
    document.getElementById('modalAuto').classList.add('show');
}

// ================= EDITAR AUTO =================
async function editarAuto(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Error al obtener auto');

        const auto = await response.json();

        document.getElementById('modalTitle').textContent = 'Editar Auto';
        document.getElementById('autoId').value = auto.vehiculo;
        document.getElementById('marca').value = auto.marca;
        document.getElementById('model').value = auto.model;
        document.getElementById('version').value = auto.version;
        document.getElementById('year').value = auto.year;
        document.getElementById('categoria').value = auto.categoria;
        document.getElementById('carroceria').value = auto.carroceria;
        document.getElementById('combustible').value = auto.combustible;
        document.getElementById('descripcion').value = auto.descripcion;
        document.getElementById('precio').value = auto.precio;
        document.getElementById('estado').value = auto.estado;
        document.getElementById('imagen').value = auto.imagen;

        document.getElementById('modalAuto').classList.add('show');

    } catch (error) {
        alert('Error al cargar auto');
        console.error(error);
    }
}

// ================= GUARDAR AUTO =================
document.getElementById('formAuto').addEventListener('submit', async (e) => {
    e.preventDefault();

    const autoId = document.getElementById('autoId').value;

    const auto = {
        marca: document.getElementById('marca').value,
        model: document.getElementById('model').value,
        version: document.getElementById('version').value,
        year: parseInt(document.getElementById('year').value),
        categoria: document.getElementById('categoria').value,
        carroceria: document.getElementById('carroceria').value,
        combustible: document.getElementById('combustible').value,
        descripcion: document.getElementById('descripcion').value,
        precio: parseFloat(document.getElementById('precio').value),
        estado: document.getElementById('estado').value,
        imagen: document.getElementById('imagen').value
    };

    try {
        let response;

        if (autoId) {
            response = await fetch(`${API_URL}/${autoId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(auto)
            });
        } else {
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(auto)
            });
        }

        if (!response.ok) throw new Error('Error al guardar');

        alert(autoId ? 'Auto actualizado' : 'Auto creado');
        cerrarModal();
        cargarAutos();

    } catch (error) {
        alert('Error al guardar auto');
        console.error(error);
    }
});

// ================= ELIMINAR =================
function eliminarAuto(id) {
    autoIdEliminar = id;
    document.getElementById('modalConfirmar').classList.add('show');
}

async function confirmarEliminar() {
    if (!autoIdEliminar) return;

    await fetch(`${API_URL}/${autoIdEliminar}`, {
        method: 'DELETE'
    });

    cerrarModalConfirmar();
    cargarAutos();
}

// ================= CERRAR =================
function cerrarModal() {
    document.getElementById('modalAuto').classList.remove('show');
}

function cerrarModalConfirmar() {
    document.getElementById('modalConfirmar').classList.remove('show');
    autoIdEliminar = null;
}

document.addEventListener('DOMContentLoaded', cargarAutos);