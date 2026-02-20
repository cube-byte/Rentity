const URL_API = "http://localhost:9090/api/v12/autos";
const tbody = document.querySelector("#tbodyAutos");

let autosGlobal = [];
let idAutoAEliminar = null;

// cuando carga la página
document.addEventListener("DOMContentLoaded", () => {
  listarAutos();

  filtroVehiculos.addEventListener("change", filtrarAutos);
  filtroDisponibilidad.addEventListener("change", filtrarAutos);
  buscadorPlaca.addEventListener("input", filtrarAutos);
});

function nombreVehiculo(auto) {
  return `${auto.vehiculo.marca} ${auto.vehiculo.model} ${auto.vehiculo.year}`;
}

function estadoClase(estado) {
  switch (estado) {
    case "DISPONIBLE":
      return "disponible-state";
    case "OCUPADO":
      return "ocupado-state";
    case "EN MANTENIMIENTO":
      return "mantenimiento-state";
    case "FUERA DE SERVICIO":
      return "fuera_servicio-state";
    default:
      return "desconocido";
  }
}

function listarAutos() {
  fetch(URL_API)
    .then(res => res.json())
    .then(data => {
      autosGlobal = data;
      cargarVehiculos(data);
      renderAutos(data);
    })
    .catch(err => console.error("Error al listar autos:", err));
}

function fechanormal(fecha){
  fechaObj = new Date(fecha);
  return fechaObj.toLocaleDateString();
}


function renderAutos(lista) {
  tbody.innerHTML = "";

  lista.forEach(auto => {

    const nombre = nombreVehiculo(auto);

    const fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${auto.auto}</td>
        <td>${auto.placa}</td>
        <td>${nombre}</td>
        <td>${auto.color}</td>
        <td>${auto.kilometraje}</td>
        <td>${auto.ubicacion.nombre}</td>
        <td>${fechanormal(auto.fecha_registro)}</td>
        <td style="justify-items:center;">
            <div class="estado-text ${estadoClase(auto.estado)}">
                <h5>${auto.estado}</h5>
            </div>
        </td>
        <td>
            <div class="buttons-table">
                <a class="button-crud btn-edit" href="#" data-id="${auto.auto}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#000000" viewBox="0 0 256 256"><path d="M227.31,73.37,182.63,28.68a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31L227.31,96a16,16,0,0,0,0-22.63ZM92.69,208H48V163.31l88-88L180.69,120ZM192,108.68,147.31,64l24-24L216,84.68Z"></path></svg>
                </a>
                <a class="button-crud btn-delete" href="#" onclick='mostrarModalEliminar(${JSON.stringify(auto)})'>
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

function filtrarAutos() {

  const vehiculoSeleccionado = filtroVehiculos.value.toLowerCase();
  const placa = buscadorPlaca.value.toLowerCase();
  const disponibilidad = filtroDisponibilidad.value.toLowerCase();

  const filtrados = autosGlobal.filter(auto => {

    const nombre = nombreVehiculo(auto).toLowerCase();

    const okVehiculo =
      !vehiculoSeleccionado || nombre === vehiculoSeleccionado;

    const okPlaca =
      !placa || auto.placa.toLowerCase().includes(placa);

    const okDisponibilidad =
      !disponibilidad || auto.estado.toLowerCase() === disponibilidad;

    return okVehiculo && okPlaca && okDisponibilidad;
  });

  renderAutos(filtrados);
}



document.addEventListener("click", function (e) {

  const btnEdit = e.target.closest(".btn-edit");
  if (!btnEdit) return;

  e.preventDefault();

  const id = btnEdit.dataset.id;

  window.location.href = `/fontend/html/admin/producto_edit.html?id=${id}`;
});

function mostrarModalEliminar(auto) {
  idAutoAEliminar = auto.id_auto;

  document.querySelector("#deleteImg").src =
    auto.imagen
      ? auto.imagen
      : "/fontend/img/items/item_null.png";

  document.querySelector("#deleteMarca").textContent = auto.marca;
  document.querySelector("#deleteModelo").textContent = auto.model;
  document.querySelector("#deleteYear").textContent = auto.year;

  document.querySelector("#modalDelete").classList.remove("hidden");
}

document
  .querySelector("#btnCancelDelete")
  .addEventListener("click", () => {
    document.querySelector("#modalDelete").classList.add("hidden");
    idAutoAEliminar = null;
  });
document
  .querySelector("#btnConfirmDelete")
  .addEventListener("click", eliminarAutoConfirmado);

function eliminarAutoConfirmado() {
  if (!idAutoAEliminar) return;

  fetch(`${URL_API}/${idAutoAEliminar}`, {
    method: "DELETE"
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al eliminar");
      document.querySelector("#modalDelete").classList.add("hidden");
      idAutoAEliminar = null;
      listarAutos();
    })
    .catch(err => {
      console.error(err);
      alert("No se pudo eliminar el auto");
    });
}

