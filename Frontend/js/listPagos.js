const URL_API = "http://localhost:9090/api/v12/pagos";
const tbody = document.querySelector("#tbodyPagos");

let pagosGlobal = [];

document.addEventListener("DOMContentLoaded", () => {
  listarPagos();

  buscadorPago.addEventListener("input", filtrarPagos);
  buscadorReserva.addEventListener("input", filtrarPagos);
  buscadorUsuario.addEventListener("input", filtrarPagos);
  buscadorPlaca.addEventListener("input", filtrarPagos);
  filtroVehiculos.addEventListener("change", filtrarPagos);
  filtroDisponibilidad.addEventListener("change", filtrarPagos);
});

function listarPagos() {
  fetch(URL_API)
    .then(res => res.json())
    .then(data => {
      pagosGlobal = data;
      cargarVehiculos(data);
      renderPagos(data);
    })
    .catch(err => console.error("Error al listar pagos:", err));
}

function nombreVehiculo(pago) {
  const v = pago.reserva?.vehiculo;
  if (!v) return "";
  return `${v.marca} ${v.model} ${v.year}`;
}

function fechaNormal(fecha){
  const fechaObj = new Date(fecha);
  return fechaObj.toLocaleDateString();
}

function estadoClase(estado) {
  switch (estado) {
    case "PENDIENTE": return "pendiente-state";
    case "COMPLETADO": return "realizado-state";
    case "ANULADO": return "anulado-state";
    default: return "desconocido";
  }
}
function renderPagos(lista) {
  tbody.innerHTML = "";

  lista.forEach(pago => {

    const usuario = pago.reserva.usuario.nombres || "—";
    const vehiculo = nombreVehiculo(pago);
    const placa = pago.reserva?.auto?.placa || "—";

    const fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${pago.id}</td>
        <td>${pago.reserva?.id}</td>
        <td>${usuario} ${pago.reserva.usuario.apellidos}</td>
        <td>${vehiculo}</td>
        <td>${placa}</td>
        <td>S/ ${pago.monto}</td>
        <td>${fechaNormal(pago.fecha)}</td>
        <td style="justify-items:center;">
            <div class="estado-text ${estadoClase(pago.estado)}">
            <h5>${pago.estado}</h5>
            </div>
        </td>
        <td>
            <div class="buttons-table">
                <a class="button-crud btn-confirm" href="/Frontend/html/admin/Update/Pagos.html?idPago=${pago.id}""> REALIZAR PAGO </a>
                <a class="button-crud btn-cancelx" href="#" onclick='mostrarModalEliminar(${JSON.stringify(pago)})'> CANCELAR PAGO </a>
            </div>
        </td>
    `;

    tbody.appendChild(fila);
  });
}

function cargarVehiculos(data){
  const vehiculosUnicos = new Set();

  data.forEach(p => {
    const nombre = nombreVehiculo(p);
    if(nombre) vehiculosUnicos.add(nombre);
  });

  filtroVehiculos.innerHTML =
    `<option value="">Todos los vehiculos</option>` +
    [...vehiculosUnicos]
      .map(v => `<option value="${v}">${v}</option>`)
      .join("");
}

function filtrarPagos() {

  const textoPago = buscadorPago.value.toLowerCase();
  const textoReserva = buscadorReserva.value.toLowerCase();
  const textoUsuario = buscadorUsuario.value.toLowerCase();
  const vehiculoSeleccionado = filtroVehiculos.value.toLowerCase();
  const placa = buscadorPlaca.value.toLowerCase();
  const estado = filtroDisponibilidad.value.toLowerCase();

  const filtrados = pagosGlobal.filter(p => {

    const idPago = p.id.toString();

    const okPago =
      !textoPago || idPago.includes(textoPago);

    const idReserva = p.reserva?.id?.toString() || "";

    const okReserva =
      !textoReserva || idReserva.includes(textoReserva);

    const nombreUsuario =
      p.reserva?.usuario?.nombres?.toLowerCase() || "";

    const okUsuario =
      !textoUsuario || nombreUsuario.includes(textoUsuario);

    const nombreVeh = nombreVehiculo(p).toLowerCase();

    const okVehiculo =
      !vehiculoSeleccionado || nombreVeh === vehiculoSeleccionado;

    const placaAuto =
      p.reserva?.auto?.placa?.toLowerCase() || "";

    const okPlaca =
      !placa || placaAuto.includes(placa);

    const estadoPago = p.estado.toLowerCase();

    const okEstado =
      !estado || estadoPago === estado;

    return okPago && okReserva && okUsuario && okVehiculo && okPlaca && okEstado;
  });

  renderPagos(filtrados);
}