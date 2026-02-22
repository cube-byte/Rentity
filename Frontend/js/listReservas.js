const URL_API = "http://localhost:9090/api/v12/reservas";
const tbody = document.querySelector("#tbodyAutos");

let reservasGlobal = [];
let idReservaAEliminar = null;

// cuando carga la página
document.addEventListener("DOMContentLoaded", () => {
  listarReservas();

  buscadorReserva.addEventListener("input", filtrarReserva);
  filtroVehiculos.addEventListener("change", filtrarReserva);
  buscadorPlaca.addEventListener("input", filtrarReserva);
  filtroDisponibilidad.addEventListener("change", filtrarReserva);

  document.querySelector("#btnCancelDelete").addEventListener("click", () => {
    document.querySelector("#modalDelete").classList.add("hidden");
    idReservaAEliminar = null;
  });

  // Modal eliminar: confirmar
  document.querySelector("#btnConfirmDelete").addEventListener("click", eliminarReserva);

  // Cerrar sesión
  document.getElementById("btn-cerrar-sesion").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("rentify_usuario");
    window.location.href = "../../html/login.html";
  });

  // Perfil
  const _u = JSON.parse(localStorage.getItem("rentify_usuario") || "{}");
  if (_u.email) document.getElementById("perfilEmail").textContent = _u.email;
  if (_u.rol)   document.getElementById("perfilRol").textContent   = _u.rol;
});

function nombreVehiculo(reserva) {
  return `${reserva.vehiculo.marca} ${reserva.vehiculo.model} ${reserva.vehiculo.year}`;
}

function estadoClase(estado) {
  switch (estado) {
    case "NUEVA":      return "nuevo-state";
    case "CONFIRMADA": return "confirm-state";
    case "REALIZADA":  return "proceso-state";
    case "TERMINADA":  return "terminado-state";
    default:           return "desconocido";
  }
}

function fechanormal(fecha) {
  const fechaObj = new Date(fecha);
  return fechaObj.toLocaleDateString();
}

function listarReservas() {
  fetch(URL_API)
    .then(res => res.json())
    .then(data => {
      reservasGlobal = data;
      cargarVehiculos(data);
      renderReservas(data);
    })
    .catch(err => console.error("Error al listar reservas:", err));
}


function renderReservas(lista) {
  tbody.innerHTML = "";

  lista.forEach(reserva => {
    const nombre = nombreVehiculo(reserva);
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${reserva.id}</td>
      <td>${reserva.usuario.nombres}</td>
      <td>${reserva.usuario.email}</td>
      <td>${nombre}</td>
      <td>${reserva.auto.placa}</td>
      <td>${reserva.auto.color}</td>
      <td>${fechanormal(reserva.fecha_inicio)}</td>
      <td>${fechanormal(reserva.fecha_fin)}</td>
      <td>$ ${reserva.precio_total}</td>
      <td>${fechanormal(reserva.fecha)}</td>
      <td style="justify-items:center;">
        <div class="estado-text ${estadoClase(reserva.estado)}">
          <h5>${reserva.estado}</h5>
        </div>
      </td>
      <td>
        <div class="buttons-table">
          <a class="button-crud btn-edit" href="#" data-id="${reserva.id}">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#000000" viewBox="0 0 256 256"><path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path></svg>
          </a>
          <a class="button-crud btn-delete" href="#" onclick='mostrarModalEliminar(${JSON.stringify(reserva)})'>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#000000" viewBox="0 0 256 256"><path d="M216,48H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM192,208H64V64H192ZM80,24a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H88A8,8,0,0,1,80,24Z"></path></svg>
          </a>
        </div>
      </td>
    `;

    tbody.appendChild(fila);
  });
}

function cargarVehiculos(lista) {
  const nombres = [...new Set(lista.map(r => nombreVehiculo(r)))];

  filtroVehiculos.innerHTML = `<option value="">Todos los vehículos</option>`;

  nombres.forEach(nombre => {
    const option = document.createElement("option");
    option.value = nombre;
    option.textContent = nombre;
    filtroVehiculos.appendChild(option);
  });
}

function filtrarReserva() {
  const textoReserva         = buscadorReserva.value.toLowerCase();
  const vehiculoSeleccionado = filtroVehiculos.value.toLowerCase();
  const placa                = buscadorPlaca.value.toLowerCase();
  const estado               = filtroDisponibilidad.value.toLowerCase();

  const filtrados = reservasGlobal.filter(r => {
    const okReserva  = !textoReserva || r.id.toString().includes(textoReserva);
    const okVehiculo = !vehiculoSeleccionado || nombreVehiculo(r).toLowerCase() === vehiculoSeleccionado;
    const okPlaca    = !placa || (r.auto?.placa?.toLowerCase() || "").includes(placa);
    const okEstado   = !estado || r.estado.toLowerCase() === estado;
    return okReserva && okVehiculo && okPlaca && okEstado;
  });
  renderReservas(filtrados);
}


document.addEventListener("click", function (e) {
  const btnEdit = e.target.closest(".btn-edit");
  if (!btnEdit) return;
  e.preventDefault();

  const id = btnEdit.dataset.id;
  window.location.href = `/Frontend/html/admin/Update/Reservas.html?id=${id}`;
});

function mostrarModalEliminar(reserva) {
  idReservaAEliminar = reserva.id;
  document.querySelector("#deletePlaca").textContent    = reserva.auto.placa;
  document.querySelector("#deleteVehiculo").textContent = nombreVehiculo(reserva);

  document.querySelector("#modalDelete").classList.remove("hidden");  
}

function eliminarReserva() {
  if (!idReservaAEliminar) return;

  fetch(`${URL_API}/${idReservaAEliminar}`, { method: "DELETE" })
    .then(res => {
      if (!res.ok) return res.text().then(t => { throw new Error(t) });
      document.querySelector("#modalDelete").classList.add("hidden");
      idReservaAEliminar = null;
      listarReservas();
    })
    .catch(err => {
      console.error("Error al eliminar reserva:", err.message);
      alert("Error: " + err.message);
    });
}