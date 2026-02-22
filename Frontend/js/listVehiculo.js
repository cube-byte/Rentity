const URL_API = "http://localhost:9090/api/v12/vehiculos";

const tbody = document.querySelector("#tbodyAutos");
let vehiculosGlobal = [];
let idvehiculoAEliminar = null;
let listaAutos = [];



function contarAutos(id) {
  return listaAutos.filter(a => a.vehiculo.vehiculo === Number(id)).length;
}

function contarAutosDisponibles(id) {
  return listaAutos.filter(a =>
    a.vehiculo.vehiculo === Number(id) &&
    a.estado === "DISPONIBLE"
  ).length;
}

function estadoClase(estado) {
  switch (estado) {
    case "DISPONIBLE": return "disponible";
    case "INACTIVO":   return "inactivo";
    default:           return "inactivo";
  }
}



function listarVehiculos() {
  fetch(URL_API)
    .then(res => res.json())
    .then(data => {
      vehiculosGlobal = data;
      cargarMarcas(data);
      renderVehiculos(data);
    })
    .catch(err => console.error("Error al listar Vehiculos:", err));
}



function renderVehiculos(lista) {
  tbody.innerHTML = "";

  lista.forEach(vehiculo => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${vehiculo.vehiculo}</td>
      <td>
        <img src='${vehiculo.imagen ?? "/Frontend/recursos/img/autos/car_null.png"}' alt="">
      </td>
      <td>${vehiculo.model}</td>
      <td>${vehiculo.marca}</td>
      <td>${vehiculo.year}</td>
      <td>${vehiculo.categoria ?? "-"}</td>
      <td>$${vehiculo.precio}</td>
      <td>${contarAutos(vehiculo.vehiculo)}</td>
      <td>${contarAutosDisponibles(vehiculo.vehiculo)}</td>
      <td style="justify-items: center;">
        <div class="estado ${estadoClase(vehiculo.estado)}"></div>
      </td>
      <td>
        <div class="buttons-table">
          <a class="button-crud btn-edit" href="#" data-id="${vehiculo.vehiculo}">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#000000" viewBox="0 0 256 256"><path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path></svg>
          </a>
          <a class="button-crud btn-delete" href="#" onclick='mostrarModalEliminar(${JSON.stringify(vehiculo)})'>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#000000" viewBox="0 0 256 256"><path d="M216,48H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM192,208H64V64H192ZM80,24a8,8,0,0,1,8-8h80a8,8,0,0,1,0,16H88A8,8,0,0,1,80,24Z"></path></svg>
          </a>
        </div>
      </td>
    `;

    tbody.appendChild(fila);
  });
}



function cargarMarcas(lista) {
  const marcas = [...new Set(lista.map(a => a.marca))];

  filtroMarca.innerHTML = `<option value="">Todas las marcas</option>`;

  marcas.forEach(marca => {
    const option = document.createElement("option");
    option.value = marca;
    option.textContent = marca;
    filtroMarca.appendChild(option);
  });
}

function filtrarVehiculos() {
  const marca = filtroMarca.value.toLowerCase();
  const modelo = buscadorModelo.value.toLowerCase();

  const filtrados = vehiculosGlobal.filter(vehiculo => {
    const okMarca  = !marca || vehiculo.marca.toLowerCase() === marca;
    const okModelo = vehiculo.model.toLowerCase().includes(modelo);
    return okMarca && okModelo;
  });

  renderVehiculos(filtrados);
}



document.addEventListener("DOMContentLoaded", () => {
    fetch("http://localhost:9090/api/v12/autos")
    .then(res => res.json())
    .then(data => {
      listaAutos = data;
      listarVehiculos();
    });

  filtroMarca.addEventListener("change", filtrarVehiculos);
  buscadorModelo.addEventListener("input", filtrarVehiculos);

  // ── CERRAR SESIÓN ──────────────────────────────
  document.getElementById('btn-cerrar-sesion').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('rentify_usuario');
    window.location.href = '../../html/login.html';
  });

  // ── PERFIL ─────────────────────────────────────
  const _u = JSON.parse(localStorage.getItem('rentify_usuario') || '{}');
  if (_u.email) document.getElementById('perfilEmail').textContent = _u.email;
  if (_u.rol)   document.getElementById('perfilRol').textContent   = _u.rol;

  // ── MODAL DAR DE BAJA: CANCELAR ───────────────
  document.querySelector("#btnCancelDelete")
    .addEventListener("click", () => {
      document.querySelector("#modalDelete").classList.add("hidden");
      idvehiculoAEliminar = null;
    });

      // ── MODAL DAR DE BAJA: CONFIRMAR ──────────────
  document.querySelector("#btnConfirmDelete")
    .addEventListener("click", darDeBajaVehiculo);
});

// ── CLICK BOTÓN EDITAR ────────────────────────────────────────────────

document.addEventListener("click", function (e) {
  const btnEdit = e.target.closest(".btn-edit");
  if (!btnEdit) return;
  e.preventDefault();

  const id = btnEdit.dataset.id;
  window.location.href = `/Frontend/html/admin/Update/Vehiculos.html?id=${id}`;
});

// ── MODAL CAMBIAR ESTADO ──────────────────────────────────────────────

function mostrarModalEliminar(vehiculo) {
  idvehiculoAEliminar = vehiculo.vehiculo;

  document.querySelector("#deleteImg").src =
    vehiculo.imagen ? vehiculo.imagen : "/Frontend/recursos/img/autos/car_null.png";

  document.querySelector("#deleteMarca").textContent  = vehiculo.marca;
  document.querySelector("#deleteModelo").textContent = vehiculo.model;
  document.querySelector("#deleteYear").textContent   = vehiculo.year;

  // ── Cambia título y botón según el estado actual ──
  const esInactivo = vehiculo.estado === "INACTIVO";
  document.querySelector("#modalDelete h3").textContent =
    esInactivo ? "¿Activar este vehículo?" : "¿Dar de baja este vehículo?";
  document.querySelector("#btnConfirmDelete").textContent =
    esInactivo ? "Activar" : "Dar de baja";

  document.querySelector("#modalDelete").classList.remove("hidden");
}

function darDeBajaVehiculo() {
  if (!idvehiculoAEliminar) return;

  const vehiculo = vehiculosGlobal.find(v => String(v.vehiculo) === String(idvehiculoAEliminar));
  if (!vehiculo) return;

  // ── Toggle: si está INACTIVO lo activa, si está DISPONIBLE lo desactiva ──
  const nuevoEstado = vehiculo.estado === "INACTIVO" ? "DISPONIBLE" : "INACTIVO";

  const dto = {
    marca:       vehiculo.marca,
    model:       vehiculo.model,
    version:     vehiculo.version,
    year:        vehiculo.year,
    categoria:   vehiculo.categoria,
    carroceria:  vehiculo.carroceria,
    combustible: vehiculo.combustible,
    descripcion: vehiculo.descripcion,
    precio:      vehiculo.precio,
    estado:      nuevoEstado,
    imagen:      vehiculo.imagen,
  };

  const formData = new FormData();
  formData.append(
    "vehiculo",
    new Blob([JSON.stringify(dto)], { type: "application/json" })
  );

  fetch(`${URL_API}/${idvehiculoAEliminar}`, {
    method: "PUT",
    body: formData,
  })
    .then(res => {
      if (!res.ok) return res.text().then(t => { throw new Error(t) });
      document.querySelector("#modalDelete").classList.add("hidden");
      idvehiculoAEliminar = null;
      listarVehiculos();
    })
    .catch(err => {
      console.error("Error:", err.message);
      alert("Error: " + err.message);
    });
}