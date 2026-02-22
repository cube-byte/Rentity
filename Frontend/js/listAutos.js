const URL_API = "http://localhost:9090/api/v12/autos";
const URL_API_VEHICULOS = "http://localhost:9090/api/v12/vehiculos";
const URL_API_UBICACIONES = "http://localhost:9090/api/v12/ubicaciones";

const tbody = document.querySelector("#tbodyAutos");

let autosGlobal = [];
let idAutoAEliminar = null;

// cuando carga la página
document.addEventListener("DOMContentLoaded", () => {
  listarAutos();

  filtroVehiculos.addEventListener("change", filtrarAutos);
  filtroDisponibilidad.addEventListener("change", filtrarAutos);
  buscadorPlaca.addEventListener("input", filtrarAutos);

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
  
  // ── CARGAR SELECTS DEL MODAL EDITAR ──────────
  cargarSelectVehiculos();
  cargarSelectUbicaciones();

  // ── MODAL EDITAR: CANCELAR ────────────────────
  document.getElementById("btnCancelEdit")
    .addEventListener("click", () => {
      document.getElementById("modalEdit").classList.add("hidden");
    });

  // ── MODAL EDITAR: GUARDAR ─────────────────────
  document.getElementById("formEditAuto")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      const id = document.getElementById("editIdAuto").value;

      const body = {
        placa:       document.getElementById("editPlaca").value.trim(),
        vehiculo:    Number(document.getElementById("editVehiculo").value),
        color:       document.getElementById("editColor").value.trim(),
        kilometraje: Number(document.getElementById("editKilometraje").value),
        estado:      document.getElementById("editEstado").value,
        ubicacion:   Number(document.getElementById("editUbicacion").value),
      };

      fetch(`${URL_API}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then(res => {
          if (!res.ok) return res.text().then(text => { throw new Error(text) });
          document.getElementById("modalEdit").classList.add("hidden");
          listarAutos();
        })
        .catch(err => {
          console.error("Error al actualizar:", err.message);
          alert("Error: " + err.message);
        });
    });

  // ── MODAL ELIMINAR: CANCELAR ──────────────────
  document.querySelector("#btnCancelDelete")
    .addEventListener("click", () => {
      document.querySelector("#modalDelete").classList.add("hidden");
      idAutoAEliminar = null;
    });

  // ── MODAL ELIMINAR: CONFIRMAR ─────────────────
  document.querySelector("#btnConfirmDelete")
    .addEventListener("click", eliminarAutoConfirmado);
});

function nombreVehiculo(auto) {
  return `${auto.vehiculo.marca} ${auto.vehiculo.model} ${auto.vehiculo.year}`;
}

function estadoClase(estado) {
  switch (estado) {
    case "DISPONIBLE":        return "disponible-state";
    case "OCUPADO":           return "ocupado-state";
    case "EN MANTENIMIENTO":  return "mantenimiento-state";
    case "FUERA DE SERVICIO": return "fuera_servicio-state";
    default:                  return "desconocido";
  }
}

function fechanormal(fecha) {
  const fechaObj = new Date(fecha);
  return fechaObj.toLocaleDateString();
}

function listarAutos() {
  fetch(URL_API)
    .then(res => res.json())
    .then(data => {
      autosGlobal = data;
      cargarVehiculos(data);
      renderAutos(data);
    })
    .catch(err => console.error("Error al listar autos:", err));
}

function fechanormal(fecha){
  fechaObj = new Date(fecha);
  return fechaObj.toLocaleDateString();
}


function renderAutos(lista) {
  tbody.innerHTML = "";

  lista.forEach(auto => {

    const nombre = nombreVehiculo(auto);

    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${auto.auto}</td>
      <td>${auto.placa}</td>
      <td>${nombre}</td>
      <td>${auto.color}</td>
      <td>${auto.kilometraje}</td>
      <td>${auto.ubicacion.nombre}</td>
      <td>${fechanormal(auto.fecha_registro)}</td>
      <td style="justify-items:center;">
        <div class="estado-text ${estadoClase(auto.estado)}">
          <h5>${auto.estado}</h5>
        </div>
      </td>
      <td>
        <div class="buttons-table">
          <a class="button-crud btn-edit" href="#" data-id="${auto.auto}">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#000000" viewBox="0 0 256 256"><path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path></svg>
          </a>
          <a class="button-crud btn-delete" href="#" onclick='mostrarModalEliminar(${JSON.stringify(auto)})'>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#000000" viewBox="0 0 256 256"><path d="M216,48H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM192,208H64V64H192ZM80,24a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H88A8,8,0,0,1,80,24Z"></path></svg>
          </a>
        </div>
      </td>
    `;

    tbody.appendChild(fila);
  });
}

function cargarVehiculos(lista) {
  const nombres = [...new Set(lista.map(auto => nombreVehiculo(auto)))];

  filtroVehiculos.innerHTML = `<option value="">Todos los vehículos</option>`;

  nombres.forEach(nombre => {
    const option = document.createElement("option");
    option.value = nombre;
    option.textContent = nombre;
    filtroVehiculos.appendChild(option);
  });
}

function filtrarAutos() {

  const vehiculoSeleccionado = filtroVehiculos.value.toLowerCase();
  const placa = buscadorPlaca.value.toLowerCase();
  const disponibilidad = filtroDisponibilidad.value.toLowerCase();

  const filtrados = autosGlobal.filter(auto => {

    const nombre = nombreVehiculo(auto).toLowerCase();

    const okVehiculo     = !vehiculoSeleccionado || nombre === vehiculoSeleccionado;
    const okPlaca        = !placa || auto.placa.toLowerCase().includes(placa);
    const okDisponibilidad = !disponibilidad || auto.estado.toLowerCase() === disponibilidad;

    return okVehiculo && okPlaca && okDisponibilidad;
  });

  renderAutos(filtrados);
}

document.addEventListener("click", function (e) {
  const btnEdit = e.target.closest(".btn-edit");
  if (!btnEdit) return;
  e.preventDefault();

  const id   = btnEdit.dataset.id;
  const auto = autosGlobal.find(a => String(a.auto) === String(id));
  if (auto) mostrarModalEditar(auto);
});

// ── MODAL EDITAR ──────────────────────────────────────────────────────

function cargarSelectVehiculos() {
  fetch(URL_API_VEHICULOS)
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("editVehiculo");
      select.innerHTML = `<option value="">Selecciona vehículo</option>`;
      data.forEach(v => {
        const option = document.createElement("option");
        option.value = v.vehiculo ?? v.id_vehiculo ?? v.id; // cubre los nombres más comunes
        option.textContent = `${v.marca} ${v.model} ${v.year}`;
        select.appendChild(option);
      });
    })
    .catch(err => console.error("Error al cargar vehículos:", err));
}

function cargarSelectUbicaciones() {
  fetch(URL_API_UBICACIONES)
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("editUbicacion");
      select.innerHTML = `<option value="">Selecciona ubicación</option>`;
      data.forEach(u => {
        const option = document.createElement("option");
        option.value = u.ubicacion ?? u.id_ubicacion ?? u.id; // cubre los nombres más comunes
        option.textContent = u.nombre;
        select.appendChild(option);
      });
    })
    .catch(err => console.error("Error al cargar ubicaciones:", err));
}

function mostrarModalEditar(auto) {
  document.getElementById("editIdAuto").value      = auto.auto;
  document.getElementById("editPlaca").value       = auto.placa;
  document.getElementById("editColor").value       = auto.color;
  document.getElementById("editKilometraje").value = auto.kilometraje;
  document.getElementById("editEstado").value      = auto.estado;

  // Seleccionar el vehículo actual en el select
  const idVehiculo = auto.vehiculo.vehiculo ?? auto.vehiculo.id_vehiculo ?? auto.vehiculo.id;
  document.getElementById("editVehiculo").value = idVehiculo;

  // Seleccionar la ubicación actual en el select
  const idUbicacion = auto.ubicacion.ubicacion ?? auto.ubicacion.id_ubicacion ?? auto.ubicacion.id;
  document.getElementById("editUbicacion").value = idUbicacion;

  document.getElementById("modalEdit").classList.remove("hidden");
}

// ── MODAL ELIMINAR ────────────────────────────────────────────────────

function mostrarModalEliminar(auto) {
  idAutoAEliminar = auto.auto;

  document.querySelector("#deletePlaca").textContent   = auto.placa;
  document.querySelector("#deleteVehiculo").textContent = nombreVehiculo(auto);

  document.querySelector("#modalDelete").classList.remove("hidden");
}

function eliminarAutoConfirmado() {
  if (!idAutoAEliminar) return;

  // Buscar el auto actual para conservar todos sus campos
  const auto = autosGlobal.find(a => String(a.auto) === String(idAutoAEliminar));
  if (!auto) return;

  const idVehiculo  = auto.vehiculo.vehiculo ?? auto.vehiculo.id_vehiculo ?? auto.vehiculo.id;
  const idUbicacion = auto.ubicacion.ubicacion ?? auto.ubicacion.id_ubicacion ?? auto.ubicacion.id;

  const body = {
    placa:       auto.placa,
    vehiculo:    Number(idVehiculo),
    color:       auto.color,
    kilometraje: Number(auto.kilometraje),
    estado:      "FUERA DE SERVICIO",   // 👈 solo cambia esto
    ubicacion:   Number(idUbicacion),
  };

  fetch(`${URL_API}/${idAutoAEliminar}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
    .then(res => {
      if (!res.ok) return res.text().then(text => { throw new Error(text) });
      document.querySelector("#modalDelete").classList.add("hidden");
      idAutoAEliminar = null;
      listarAutos();
    })
    .catch(err => {
      console.error("Error al cambiar estado:", err.message);
      alert("Error: " + err.message);
    });
}