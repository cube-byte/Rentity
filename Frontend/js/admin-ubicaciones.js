const API_URL = "http://localhost:9090/api/v12/ubicaciones";

// ─── Estado 
let ubicaciones = [];
let ubicacionEditandoId = null;

// ─── Elementos del DOM
const tbody             = document.getElementById("tbodyUbicaciones");
const buscador          = document.getElementById("buscadorUbicacion");

const modalForm         = document.getElementById("modalUbicacion");
const modalTitulo       = document.getElementById("modalUbicacionTitulo");
const inputNombre       = document.getElementById("inputNombre");
const btnAbrirModal     = document.getElementById("btnAbrirModal");
const btnCancelarForm   = document.getElementById("btnCancelarUbicacion");
const btnGuardar        = document.getElementById("btnGuardarUbicacion");

const modalDelete       = document.getElementById("modalDelete");
const deleteNombreEl    = document.getElementById("deleteNombre");
const btnCancelDelete   = document.getElementById("btnCancelDelete");
const btnConfirmDelete  = document.getElementById("btnConfirmDelete");

// ─── Cargar ubicaciones desde el backend
async function cargarUbicaciones() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Error al obtener ubicaciones");
        ubicaciones = await res.json();
        renderTabla(ubicaciones);
    } catch (err) {
        console.error(err);
        tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:#999;">No se pudieron cargar las ubicaciones.</td></tr>`;
    }
}

// ─── Renderizar tabla
function renderTabla(lista) {
    tbody.innerHTML = "";

    if (lista.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:#999;">Sin resultados.</td></tr>`;
        return;
    }

    lista.forEach((ub, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${ub.nombre}</td>
            <td>
                <div class="buttons-table">
                    <button class="button-crud btn-edit" onclick="abrirEditar(${ub.id}, '${escapeHtml(ub.nombre)}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#000000" viewBox="0 0 256 256">
                            <path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path>
                        </svg>
                    </button>
                    <button class="button-crud btn-delete" onclick="abrirEliminar(${ub.id}, '${escapeHtml(ub.nombre)}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#000000" viewBox="0 0 256 256">
                            <path d="M216,48H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM192,208H64V64H192ZM80,24a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H88A8,8,0,0,1,80,24Z"></path>
                        </svg>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ─── Buscador
buscador.addEventListener("input", () => {
    const q = buscador.value.toLowerCase();
    const filtradas = ubicaciones.filter(u => u.nombre.toLowerCase().includes(q));
    renderTabla(filtradas);
});

// ─── Modal Crear 
btnAbrirModal.addEventListener("click", () => {
    ubicacionEditandoId = null;
    modalTitulo.textContent = "Nueva Ubicación";
    inputNombre.value = "";
    modalForm.classList.remove("hidden");
    inputNombre.focus();
});

btnCancelarForm.addEventListener("click", () => {
    modalForm.classList.add("hidden");
});

// ─── Modal Editar 
function abrirEditar(id, nombre) {
    ubicacionEditandoId = id;
    modalTitulo.textContent = "Editar Ubicación";
    inputNombre.value = nombre;
    modalForm.classList.remove("hidden");
    inputNombre.focus();
}

// ─── Guardar (Crear o Editar) 
btnGuardar.addEventListener("click", async () => {
    const nombre = inputNombre.value.trim();
    if (!nombre) {
        inputNombre.style.borderColor = "#e53935";
        inputNombre.focus();
        return;
    }
    inputNombre.style.borderColor = "";

    const body = JSON.stringify({ nombre });
    const headers = { "Content-Type": "application/json" };

    try {
        if (ubicacionEditandoId === null) {
            // CREAR
            const res = await fetch(API_URL, { method: "POST", headers, body });
            if (!res.ok) throw new Error("Error al crear");
        } else {
            // EDITAR
            const res = await fetch(`${API_URL}/${ubicacionEditandoId}`, { method: "PUT", headers, body });
            if (!res.ok) throw new Error("Error al editar");
        }
        modalForm.classList.add("hidden");
        await cargarUbicaciones();
    } catch (err) {
        console.error(err);
        alert("Ocurrió un error al guardar. Revisa la consola.");
    }
});

// ─── Modal Eliminar 
let eliminarId = null;

function abrirEliminar(id, nombre) {
    eliminarId = id;
    deleteNombreEl.textContent = nombre;
    modalDelete.classList.remove("hidden");
}

btnCancelDelete.addEventListener("click", () => {
    modalDelete.classList.add("hidden");
    eliminarId = null;
});

btnConfirmDelete.addEventListener("click", async () => {
    if (!eliminarId) return;
    try {
        const res = await fetch(`${API_URL}/${eliminarId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Error al eliminar");
        modalDelete.classList.add("hidden");
        eliminarId = null;
        await cargarUbicaciones();
    } catch (err) {
        console.error(err);
        alert("Ocurrió un error al eliminar.");
    }
});

// ─── Cerrar modales al hacer click fuera 
modalForm.addEventListener("click", (e) => {
    if (e.target === modalForm) modalForm.classList.add("hidden");
});
modalDelete.addEventListener("click", (e) => {
    if (e.target === modalDelete) modalDelete.classList.add("hidden");
});

// ─── Utilidad 
function escapeHtml(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, "&quot;");
}

// ─── Init 
cargarUbicaciones();

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