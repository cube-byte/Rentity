const URL_API = "http://localhost:9090/api/v12/vehiculos";

// ── OBTENER ID DE LA URL ──────────────────────────────────────────────
const params   = new URLSearchParams(window.location.search);
const idEditar = params.get("id");

// ── ESTADO ACTUAL (se guarda al cargar para no perderlo al editar) ────
let estadoActual = "DISPONIBLE";

// ── REFERENCIAS ───────────────────────────────────────────────────────
const btnGuardar  = document.querySelector("#btnCrear");
const inputMarca  = document.getElementById('inputMarca');
const inputModelo = document.getElementById('inputModelo');
const inputYear   = document.getElementById('inputYear');
const displayMarca  = document.getElementById('displayMarca');
const displayModelo = document.getElementById('displayModelo');
const displayYear   = document.getElementById('displayYear');
const inputImagen = document.querySelector('input[name="imagen"]');
const preview     = document.getElementById('previewImg');

// ── CUANDO CARGA LA PÁGINA ────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {

  if (!idEditar) {
    alert("No se encontró el ID del vehículo");
    window.location.href = "/Frontend/html/admin/Vehiculos.html";
    return;
  }

  cargarDatosVehiculo(idEditar);

  btnGuardar.addEventListener("click", () => editarVehiculo(idEditar));

  inputMarca.addEventListener('input', actualizarTitulo);
  inputModelo.addEventListener('input', actualizarTitulo);
  inputYear.addEventListener('input', actualizarTitulo);

  inputImagen.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) preview.src = URL.createObjectURL(file);
  });

  document.getElementById('btn-cerrar-sesion').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('rentify_usuario');
    window.location.href = '../../../html/login.html';
  });

  const _u = JSON.parse(localStorage.getItem('rentify_usuario') || '{}');
  if (_u.email) document.getElementById('perfilEmail').textContent = _u.email;
  if (_u.rol)   document.getElementById('perfilRol').textContent   = _u.rol;
});

// ── CARGAR DATOS DEL VEHÍCULO ─────────────────────────────────────────
function cargarDatosVehiculo(id) {
  fetch(`${URL_API}/${id}`)
    .then(res => {
      if (!res.ok) throw new Error("Vehículo no encontrado");
      return res.json();
    })
    .then(v => {
      // ⭐ Guardar el estado actual para no perderlo al guardar
      estadoActual = v.estado ?? "DISPONIBLE";

      inputMarca.value                                  = v.marca       ?? "";
      document.querySelector("#inputModelo").value      = v.model       ?? "";
      document.querySelector("#inputVersion").value     = v.version     ?? "";
      inputYear.value                                   = v.year        ?? "";
      document.querySelector("#categoria").value        = v.categoria   ?? "";
      document.querySelector("#inputCarroceria").value  = v.carroceria  ?? "";
      document.querySelector("#inputCombustible").value = v.combustible ?? "";
      document.querySelector("#inputDescripcion").value = v.descripcion ?? "";
      document.querySelector("#inputPrecio").value      = v.precio      ?? "";

      if (v.imagen) preview.src = v.imagen;

      actualizarTitulo();
    })
    .catch(err => {
      console.error(err);
      alert("Error al cargar el vehículo: " + err.message);
    });
}

// ── GUARDAR CAMBIOS (PUT) ─────────────────────────────────────────────
function editarVehiculo(id) {
  const vehiculo = obtenerDatosFormulario();

  if (!vehiculo.marca || !vehiculo.model || !vehiculo.year || !vehiculo.precio) {
    alert("Completa los campos obligatorios");
    return;
  }

  const imagen = inputImagen.files[0];
  const formData = new FormData();
  formData.append("vehiculo", new Blob([JSON.stringify(vehiculo)], { type: "application/json" }));
  if (imagen) formData.append("imagen", imagen);

  fetch(`${URL_API}/${id}`, {
    method: "PUT",
    body: formData,
  })
    .then(res => {
      if (!res.ok) return res.text().then(t => { throw new Error(t) });
    })
    .then(() => {
      alert("Vehículo actualizado correctamente");
      window.location.href = "/Frontend/html/admin/Vehiculos.html";
    })
    .catch(err => {
      console.error(err);
      alert("Error al actualizar: " + err.message);
    });
}

// ── HELPER: leer campos + conservar estado actual ─────────────────────
function obtenerDatosFormulario() {
  return {
    marca:       document.querySelector("#inputMarca").value.trim(),
    model:       document.querySelector("#inputModelo").value.trim(),
    version:     document.querySelector("#inputVersion").value.trim(),
    year:        parseInt(document.querySelector("#inputYear").value),
    categoria:   document.querySelector("#categoria").value,
    carroceria:  document.querySelector("#inputCarroceria").value.trim(),
    combustible: document.querySelector("#inputCombustible").value,
    descripcion: document.querySelector("#inputDescripcion").value.trim(),
    precio:      parseFloat(document.querySelector("#inputPrecio").value),
    estado:      estadoActual,  // ⭐ se conserva el estado que tenía antes de editar
  };
}

// ── PREVIEW TÍTULO ────────────────────────────────────────────────────
function actualizarTitulo() {
  displayMarca.textContent  = inputMarca.value.trim()  ? inputMarca.value.toUpperCase()  : 'MARCA';
  displayModelo.textContent = inputModelo.value.trim() ? inputModelo.value.toUpperCase() : 'MODELO';
  displayYear.textContent   = inputYear.value.trim()   ? inputYear.value                 : 'AÑO';

  displayMarca.classList.toggle('placeholder',  !inputMarca.value.trim());
  displayModelo.classList.toggle('placeholder', !inputModelo.value.trim());
  displayYear.classList.toggle('placeholder',   !inputYear.value.trim());
}