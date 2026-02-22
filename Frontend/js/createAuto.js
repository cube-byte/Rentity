const URL_API = "http://localhost:9090/api/v12/autos";
const btnCrear = document.querySelector("#btnCrearAuto");

btnCrear.addEventListener("click", crearAuto);

function crearAuto() {

  const auto = {
    placa: document.getElementById("inputPlaca").value,
    vehiculo: document.getElementById("selectVehiculo").value,
    color: document.getElementById("inputColor").value,
    kilometraje: document.getElementById("inputKilometraje").value,
    ubicacion: document.getElementById("selectUbicacion").value
  };

  if (!auto.placa || !auto.vehiculo || !auto.color || !auto.kilometraje || !auto.ubicacion) {
    alert("Completa los campos obligatorios");
    return;
  }

  console.log(auto);

  fetch(URL_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(auto)
  })
  .then(res => {
    if (!res.ok) throw new Error("Error al crear auto");
    return res.json();
  })
  .then(() => {
    alert("Auto creado correctamente");
    window.location.href = "/Frontend/html/admin/Autos.html";
  })
  .catch(err => {
    console.error(err);
    alert("No se pudo crear");
  });
}

// ── CERRAR SESIÓN ─────────────────────────────
document.getElementById('btn-cerrar-sesion').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('rentify_usuario');
    window.location.href = '/Frontend/html/login.html';
});

// ── PERFIL ────────────────────────────────────
const _u = JSON.parse(localStorage.getItem('rentify_usuario') || '{}');
if (_u.email) document.getElementById('perfilEmail').textContent = _u.email;
if (_u.rol)   document.getElementById('perfilRol').textContent   = _u.rol;

