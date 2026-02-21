const URL_API      = "http://localhost:9090/api/v12/reservas";
const URL_USUARIOS = "http://localhost:9090/api/admin/usuarios";

const btnCrear = document.querySelector("#btnCrear");
btnCrear.addEventListener("click", crearReserva);

let listaAutos = [];

fetch("http://localhost:9090/api/v12/autos")
  .then(res => res.json())
  .then(data => listaAutos = data);

function obtenerAutoAleatorioPorVehiculo(idVehiculo) {
  const autosDisponibles = listaAutos.filter(a =>
    a.vehiculo.vehiculo === Number(idVehiculo) &&
    a.estado === "DISPONIBLE"
  );
  if (autosDisponibles.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * autosDisponibles.length);
  return autosDisponibles[randomIndex].auto;
}

function FechaFormatoLocalDateTime(fecha) {
  if (!fecha) return null;
  return fecha + "T10:00:00";
}

function crearReserva() {
  const usuarioId  = document.getElementById("buscarCliente").value;
  const vehiculoId = document.getElementById("vehiculoId").value;
  const autoId     = obtenerAutoAleatorioPorVehiculo(vehiculoId);

  const reserva = {
    idUsuario:   Number(usuarioId),
    idVehiculo:  Number(vehiculoId),
    idAuto:      Number(autoId),
    fecha_inicio: FechaFormatoLocalDateTime(document.getElementById("fechaInicio").value),
    fecha_fin:    FechaFormatoLocalDateTime(document.getElementById("fechaFin").value),
  };

  if (!reserva.idUsuario || !reserva.idVehiculo || !reserva.idAuto || !reserva.fecha_inicio || !reserva.fecha_fin) {
    alert("Completa los campos obligatorios");
    return;
  }

  fetch(URL_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reserva)
  })
  .then(res => res.json())
  .then(data => {
    alert("Reserva creada");
    console.log(data);
  })
  .catch(err => console.error("Error:", err));
}

// ── AUTOCOMPLETAR CLIENTE POR ID ──────────────────────────
function limpiarCamposCliente() {
  document.getElementById('inputNombres').value  = '';
  document.getElementById('inputEmail').value    = '';
  document.getElementById('inputTelefono').value = '';
  document.getElementById('inputDni').value      = '';
}

document.getElementById('buscarCliente').addEventListener('keydown', async (e) => {
  // Dispara al presionar Enter
  if (e.key !== 'Enter') return;

  const id = e.target.value.trim();

  if (!id) {
    limpiarCamposCliente();
    return;
  }

  try {
    const res = await fetch(`${URL_USUARIOS}/${id}`);

    if (!res.ok) throw new Error('No encontrado');

    const cliente = await res.json();

    document.getElementById('inputNombres').value  = `${cliente.nombres ?? ''} ${cliente.apellidos ?? ''}`.trim();
    document.getElementById('inputEmail').value    = cliente.email      ?? '';
    document.getElementById('inputTelefono').value = cliente.telefono   ?? '';
    document.getElementById('inputDni').value      = cliente.documento  ?? '';

  } catch (err) {
    alert('Cliente no encontrado. Verifica el ID.');
    limpiarCamposCliente();
  }
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