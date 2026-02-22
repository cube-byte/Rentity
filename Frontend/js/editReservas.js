const URL_API      = "http://localhost:9090/api/v12/reservas";
const URL_USUARIOS = "http://localhost:9090/api/admin/usuarios";

// ── OBTENER ID DE LA URL ──────────────────────────────────────────────
const params    = new URLSearchParams(window.location.search);
const reservaId = params.get("id");

if (!reservaId) {
  alert("No se encontró el ID de la reserva");
  window.location.href = "/Frontend/html/admin/Reservas.html";
}

// ── CARGAR DATOS AL INICIAR ───────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {

  // Perfil
  const _u = JSON.parse(localStorage.getItem("rentify_usuario") || "{}");
  if (_u.email) document.getElementById("perfilEmail").textContent = _u.email;
  if (_u.rol)   document.getElementById("perfilRol").textContent   = _u.rol;

  // Cerrar sesión
  document.getElementById("btn-cerrar-sesion").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("rentify_usuario");
    window.location.href = "../../../html/login.html";
  });

  // Cancelar → volver a la lista
  document.getElementById("btnCancelar").addEventListener("click", () => {
    window.location.href = "/Frontend/html/admin/Reservas.html";
  });

  // Guardar cambios
  document.getElementById("btnGuardar").addEventListener("click", guardarReserva);

  // Buscar cliente por Enter
  document.getElementById("buscarCliente").addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;
    await buscarClientePorId(e.target.value.trim());
  });

  // Cargar reserva existente
  try {
    const res = await fetch(`${URL_API}/${reservaId}`);
    if (!res.ok) throw new Error("Reserva no encontrada");
    const reserva = await res.json();
    precargarFormulario(reserva);
  } catch (err) {
    alert("Error al cargar la reserva: " + err.message);
    window.location.href = "/Frontend/html/admin/Reservas.html";
  }
});

// ── PRECARGAR FORMULARIO CON DATOS DE LA RESERVA ─────────────────────
function precargarFormulario(reserva) {

  // Título
  document.getElementById("tituloId").textContent = `#${reserva.id}`;

  // Cliente
  document.getElementById("buscarCliente").value  = reserva.usuario.id ?? "";
  document.getElementById("inputNombres").value   = `${reserva.usuario.nombres ?? ""} ${reserva.usuario.apellidos ?? ""}`.trim();
  document.getElementById("inputEmail").value     = reserva.usuario.email    ?? "";
  document.getElementById("inputTelefono").value  = reserva.usuario.telefono ?? "";
  document.getElementById("inputDni").value       = reserva.usuario.documento ?? "";

  // Vehículo y auto
  document.getElementById("vehiculoId").value = reserva.vehiculo?.vehiculo ?? "";
  document.getElementById("autoId").value     = reserva.auto?.auto ?? "";

  // Mostrar vehiculo seleccionado en el selector
  const seleccionado = document.getElementById("vehiculoSeleccionado");
  seleccionado.innerHTML = `
    <div class="vehiculo-card">
      <div class="vehiculo_rederizar-img">
        <img src="${reserva.vehiculo?.imagen ?? "/Frontend/recursos/img/autos/car_null.png"}" style="width:60px; border-radius:6px;">
        <div class="info">
          <h3>${reserva.vehiculo?.marca} ${reserva.vehiculo?.model}</h3>
          <p>${reserva.vehiculo?.year} • ${reserva.vehiculo?.categoria ?? ""}</p>
          <span>S/ ${reserva.vehiculo?.precio} por día</span>
        </div>
      </div>
    </div>
  `;
  document.getElementById("precio-vista").textContent = reserva.vehiculo?.precio ?? 0;

  // Fechas (LocalDateTime → date input: tomar solo los primeros 10 chars)
  if (reserva.fecha_inicio)
    document.getElementById("fechaInicio").value = reserva.fecha_inicio.substring(0, 10);
  if (reserva.fecha_fin)
    document.getElementById("fechaFin").value = reserva.fecha_fin.substring(0, 10);

  // Estado
  document.getElementById("estadoReserva").value = reserva.estado ?? "NUEVA";

  // Recalcular precio
  calcularDesdeReserva(reserva);
}

function calcularDesdeReserva(reserva) {
  const inicio    = reserva.fecha_inicio?.substring(0, 10);
  const fin       = reserva.fecha_fin?.substring(0, 10);
  const precioDia = parseFloat(reserva.vehiculo?.precio) || 0;

  if (!inicio || !fin) return;

  const dias  = Math.ceil((new Date(fin) - new Date(inicio)) / 86400000);
  const total = dias * precioDia;

  document.getElementById("dias-vista").textContent = dias;
  document.getElementById("precio-vista").textContent = precioDia;
  document.getElementById("precio").textContent      = total;
  document.getElementById("subtotal").textContent    = "S/ " + total;
}

// ── BUSCAR CLIENTE ────────────────────────────────────────────────────
async function buscarClientePorId(id) {
  if (!id) {
    limpiarCamposCliente();
    return;
  }
  try {
    const res = await fetch(`${URL_USUARIOS}/${id}`);
    if (!res.ok) throw new Error("No encontrado");
    const cliente = await res.json();
    document.getElementById("inputNombres").value  = `${cliente.nombres ?? ""} ${cliente.apellidos ?? ""}`.trim();
    document.getElementById("inputEmail").value    = cliente.email     ?? "";
    document.getElementById("inputTelefono").value = cliente.telefono  ?? "";
    document.getElementById("inputDni").value      = cliente.documento ?? "";
  } catch {
    alert("Cliente no encontrado. Verifica el ID.");
    limpiarCamposCliente();
  }
}

function limpiarCamposCliente() {
  document.getElementById("inputNombres").value  = "";
  document.getElementById("inputEmail").value    = "";
  document.getElementById("inputTelefono").value = "";
  document.getElementById("inputDni").value      = "";
}

// ── GUARDAR CAMBIOS (PUT) ─────────────────────────────────────────────
function FechaFormatoLocalDateTime(fecha) {
  if (!fecha) return null;
  return fecha + "T10:00:00";
}

async function guardarReserva() {
  const usuarioId  = document.getElementById("buscarCliente").value;
  const vehiculoId = document.getElementById("vehiculoId").value;
  const autoId     = document.getElementById("autoId").value;
  const estado     = document.getElementById("estadoReserva").value;
  const fechaIni   = document.getElementById("fechaInicio").value;
  const fechaFin   = document.getElementById("fechaFin").value;
  const total      = parseFloat(document.getElementById("precio").textContent) || 0;

  if (!usuarioId || !vehiculoId || !autoId || !fechaIni || !fechaFin) {
    alert("Completa todos los campos obligatorios");
    return;
  }

  const dto = {
    idUsuario:    Number(usuarioId),
    idVehiculo:   Number(vehiculoId),
    idAuto:       Number(autoId),
    fecha_inicio: FechaFormatoLocalDateTime(fechaIni),
    fecha_fin:    FechaFormatoLocalDateTime(fechaFin),
    precio_total: total,
    estado:       estado,
  };

  try {
    const res = await fetch(`${URL_API}/${reservaId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg);
    }

    alert("Reserva actualizada correctamente");
    window.location.href = "/Frontend/html/admin/Reservas.html";

  } catch (err) {
    console.error("Error al actualizar:", err.message);
    alert("Error: " + err.message);
  }
}