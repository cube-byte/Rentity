const URL_API = "http://localhost:9090/api/v12/reservas";
const tbody = document.querySelector("#tbodyAutos");

let reservasGlobal = [];

// cuando carga la página
document.addEventListener("DOMContentLoaded", () => {
  listarReservas();

  buscadorReserva.addEventListener("input", filtrarReserva);
  filtroVehiculos.addEventListener("change", filtrarReserva);
  buscadorPlaca.addEventListener("input", filtrarReserva);
  filtroDisponibilidad.addEventListener("change", filtrarReserva);
});

function nombreVehiculo(reserva) {
  return `${reserva.vehiculo.marca} ${reserva.vehiculo.model} ${reserva.vehiculo.year}`;
}

function estadoClase(estado) {
  switch (estado) {
    case "NUEVA":
      return "nuevo-state";
    case "CONFIRMADA":
      return "confirm-state";
    case "REALIZADA":
      return "proceso-state";
    case "TERMINADA":
      return "terminado-state";
    default:
      return "desconocido";
  }
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

function fechanormal(fecha){
  fechaObj = new Date(fecha);
  return fechaObj.toLocaleDateString();
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
                <a class="button-crud btn-edit" href="#" data-id="${reserva.auto}">
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

  const nombres = [
    ...new Set(lista.map(auto => nombreVehiculo(auto)))
  ];

  filtroVehiculos.innerHTML = `<option value="">Todos los vehículos</option>`;

  nombres.forEach(nombre => {
    const option = document.createElement("option");
    option.value = nombre;
    option.textContent = nombre;
    filtroVehiculos.appendChild(option);
  });
}

function filtrarReserva() {

  const textoReserva = buscadorReserva.value.toLowerCase();
  const vehiculoSeleccionado = filtroVehiculos.value.toLowerCase();
  const placa = buscadorPlaca.value.toLowerCase();
  const estado = filtroDisponibilidad.value.toLowerCase();

  const filtrados = reservasGlobal.filter(r => {

    const idTexto = r.id.toString();

    const okReserva =
      !textoReserva || idTexto.includes(textoReserva);

    const nombreVeh = nombreVehiculo(r).toLowerCase();

    const okVehiculo =
      !vehiculoSeleccionado || nombreVeh === vehiculoSeleccionado;

    const placaAuto = r.auto?.placa?.toLowerCase() || "";

    const okPlaca =
      !placa || placaAuto.includes(placa);

    const estadoReserva = r.estado.toLowerCase();

    const okEstado =
      !estado || estadoReserva === estado;

    return okReserva && okVehiculo && okPlaca && okEstado;
  });
    renderReservas(filtrados);
}