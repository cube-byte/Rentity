const URL_API = "http://localhost:9090/api/v12/comprobante";
const tbody = document.querySelector("#tbodyComprobantes");

const buscadorCodigo = document.getElementById("buscadorCodigo");
const buscadorPago = document.getElementById("buscadorPago");
const buscadorUsuario = document.getElementById("buscadorUsuario");
const buscadorPlaca = document.getElementById("buscadorPlaca");
const filtroVehiculos = document.getElementById("filtroVehiculos");

let comprobantesGlobal = [];

document.addEventListener("DOMContentLoaded", () => {
  listarComprobantes();

  buscadorCodigo.addEventListener("input", filtrarComprobantes);
  buscadorPago.addEventListener("input", filtrarComprobantes);
  buscadorUsuario.addEventListener("input", filtrarComprobantes);
  buscadorPlaca.addEventListener("input", filtrarComprobantes);
  filtroVehiculos.addEventListener("change", filtrarComprobantes);
});

function listarComprobantes() {
  fetch(URL_API)
    .then(res => res.json())
    .then(data => {
      comprobantesGlobal = data;
      cargarVehiculos(data);
      renderComprobantes(data);
    })
    .catch(err => console.error("Error listando comprobantes:", err));
}

function nombreVehiculo(comp) {
  const v = comp.pago?.reserva?.vehiculo;
  if (!v) return "";
  return `${v.marca} ${v.model} ${v.year}`;
}

function fechaNormal(fecha){
  const f = new Date(fecha);
  return f.toLocaleDateString();
}

function renderComprobantes(lista) {
  tbody.innerHTML = "";

  lista.forEach(comp => {

    const pago = comp.pago;
    const reserva = pago?.reserva;
    const usuario = reserva?.usuario;
    const vehiculo = nombreVehiculo(comp);
    const placa = reserva?.auto?.placa || "—";

    const fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${comp.id}</td>
        <td><strong>${comp.codigo}</strong></td>
        <td>${pago?.id || "—"}</td>
        <td>${usuario?.nombres || ""} ${usuario?.apellidos || ""}</td>
        <td>${vehiculo}</td>
        <td>${placa}</td>
        <td>${fechaNormal(pago?.fecha)}</td>
        <td>
            <div class="buttons-table">
                <a class="button-crud btn-confirm" href="/Frontend/html/ComprobanteDetalle.html?id=${comp.id}"> VER </a>
            </div>
        </td>
    `;

    tbody.appendChild(fila);
  });
}

function cargarVehiculos(data){
  const vehiculosUnicos = new Set();

  data.forEach(c => {
    const nombre = nombreVehiculo(c);
    if(nombre) vehiculosUnicos.add(nombre);
  });

  filtroVehiculos.innerHTML =
    `<option value="">Todos los vehiculos</option>` +
    [...vehiculosUnicos]
      .map(v => `<option value="${v}">${v}</option>`)
      .join("");
}

function filtrarComprobantes() {

  const textoCodigo = buscadorCodigo.value.toLowerCase();
  const textoPago = buscadorPago.value.toLowerCase();
  const textoUsuario = buscadorUsuario.value.toLowerCase();
  const placa = buscadorPlaca.value.toLowerCase();
  const vehiculoSeleccionado = filtroVehiculos.value.toLowerCase();

  const filtrados = comprobantesGlobal.filter(c => {

    const codigo = c.codigo?.toLowerCase() || "";
    const okCodigo = !textoCodigo || codigo.includes(textoCodigo);

    const idPago = c.pago?.id?.toString() || "";
    const okPago = !textoPago || idPago.includes(textoPago);

    const nombreUsuario = c.pago?.reserva?.usuario?.nombres?.toLowerCase() || "";
    const okUsuario = !textoUsuario || nombreUsuario.includes(textoUsuario);

    const nombreVeh = nombreVehiculo(c).toLowerCase();
    const okVehiculo = !vehiculoSeleccionado || nombreVeh === vehiculoSeleccionado;

    const placaAuto = c.pago?.reserva?.auto?.placa?.toLowerCase() || "";
    const okPlaca = !placa || placaAuto.includes(placa);

    return okCodigo && okPago && okUsuario && okVehiculo && okPlaca;
  });

  renderComprobantes(filtrados);
}

function verComprobante(codigo){
  alert("Abrir comprobante: " + codigo);
}