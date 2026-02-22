const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (!id) {
  alert("No se recibió el ID del comprobante");
  throw new Error("ID faltante");
}

const URL_API = "http://localhost:9090/api/v12/comprobante";

document.addEventListener("DOMContentLoaded", () => {
  cargarComprobante();
});

function cargarComprobante() {
  fetch(`${URL_API}/${id}`)
    .then(res => {
      if (!res.ok) throw new Error("No se pudo obtener el comprobante");
      return res.json();
    })
    .then(data => pintarComprobante(data))
    .catch(err => {
      console.error(err);
      alert("Error cargando comprobante");
    });
}

function pintarComprobante(comp) {
  const pago    = comp.pago;
  const reserva = pago.reserva;
  const vehiculo = reserva.vehiculo;
  const usuario  = reserva.usuario;

  const elCodigo = document.querySelector(".header-code");
  if (elCodigo) elCodigo.textContent = comp.codigo;

  document.getElementById("clienteNombre").textContent =
    `${usuario.nombres} ${usuario.apellidos}`;

  document.getElementById("clienteCorreo").textContent =
    usuario.email;

  document.getElementById("clienteTelefono").textContent =
    usuario.telefono || "—";

  const img = document.getElementById("vehiculoImagen");
  if (img) img.src = vehiculo.imagen || "/Frontend/recursos/img/autos/car_null.png";

  document.getElementById("vehiculoNombre").textContent =
    `${vehiculo.marca} ${vehiculo.model} ${vehiculo.year}`;

  const elPlaca = document.getElementById("vehiculoPlaca");
  if (elPlaca) elPlaca.textContent = reserva.auto?.placa || "—";

  const elColor = document.getElementById("vehiculoColor");
  if (elColor) elColor.textContent = reserva.auto?.color || "—";

  document.getElementById("fechaInicio").textContent =
formatearFecha(reserva.fecha_inicio);

  document.getElementById("fechaFin").textContent =
formatearFecha(reserva.fecha_fin);

  document.getElementById("totalPago").textContent =
    `${pago.monto.toFixed(2)}`;


  document.getElementById("fechaPago").textContent =
    formatearFechaHora(pago.fecha);
}

function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}

function formatearFechaHora(fecha) {
  return new Date(fecha).toLocaleString("es-PE", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}