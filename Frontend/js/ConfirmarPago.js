const params = new URLSearchParams(window.location.search);
const idPago = params.get("idPago");

if (!idPago) {
  alert("No se recibió el ID del pago");
  throw new Error("ID de pago faltante");
}

console.log("ID DEL PAGO:", idPago);

const URL_API = "http://localhost:9090/api/v12/pagos";

document.addEventListener("DOMContentLoaded", () => {
  cargarPago();
});

function cargarPago() {
  fetch(`${URL_API}/${idPago}`)
    .then(res => {
      if (!res.ok) throw new Error("No se pudo obtener el pago");
      return res.json();
    })
    .then(pago => {
      pintarPago(pago);
    })
    .catch(err => {
      console.error(err);
      alert("Error cargando información del pago");
    });
}


function pintarPago(pago) {

  const reserva = pago.reserva;
  const vehiculo = reserva.vehiculo;
  const usuario = reserva.usuario;


  document.getElementById("autoImg").src =
    vehiculo.imagen || "../../../recursos/img/autos/car_null.png";


  document.getElementById("autoNombre").textContent =
    `${vehiculo.marca} ${vehiculo.model}`;

  document.getElementById("autoCategoria").textContent =
    `${vehiculo.categoria} · ${vehiculo.combustible} · ${vehiculo.year}`;


  document.getElementById("clienteNombre").textContent =
    `${usuario.nombres} ${usuario.apellidos}`;

  document.getElementById("clienteEmail").textContent = usuario.email;
  document.getElementById("clienteTelefono").textContent = usuario.telefono;


  const subtotal = pago.monto;
  const igv = subtotal * 0.18;
  const total = subtotal + igv;

  document.getElementById("subtotal").textContent = `S/ ${subtotal.toFixed(2)}`;
  document.getElementById("igv").textContent = `S/ ${igv.toFixed(2)}`;
  document.getElementById("total").textContent = `S/ ${total.toFixed(2)}`;
}



function confirmarPago() {

  const metodoSeleccionado = "TARJETA";

  fetch(`${URL_API}/${idPago}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      metodo: metodoSeleccionado
    })
  })
  .then(res => {
    if (!res.ok) throw new Error("No se pudo confirmar el pago");
    return res.json();
  })
  .then(() => {
    alert("Pago completado con éxito");
    window.location.href = "/Frontend/html/admin/Update/Pagos.html";
  })
  .catch(err => {
    console.error(err);
    alert("Error confirmando el pago");
  });
}

document.getElementById("formPago").addEventListener("submit", function(e) {
  e.preventDefault();
  confirmarPago();
});

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