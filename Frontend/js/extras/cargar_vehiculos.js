const URL_VEHICULOS = "http://localhost:9090/api/v12/vehiculos";

document.addEventListener("DOMContentLoaded", () => {
  cargarVehiculos();
});

function cargarVehiculos() {
  fetch(URL_VEHICULOS)
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("selectVehiculo");

      select.innerHTML = `<option value="">Seleccione vehículo</option>`;

      data.forEach(v => {
        const option = document.createElement("option");

        // texto visible
        option.textContent = `${v.marca} ${v.model} ${v.year}`;

        // valor enviado al backend
        option.value = v.vehiculo;

        select.appendChild(option);
      });
    })
    .catch(err => console.error("Error cargando vehículos:", err));
}