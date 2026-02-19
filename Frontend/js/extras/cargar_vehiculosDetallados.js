console.log("JS cargado correctamente");

const URL_VEHICULOS = "http://localhost:9090/api/v12/vehiculos";
const URL_AUTOS = "http://localhost:9090/api/v12/autos";

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM listo");
  cargarVehiculosDetallado();
});

function cargarVehiculosDetallado() {

  Promise.all([
    fetch(URL_VEHICULOS).then(r => r.json()),
    fetch(URL_AUTOS).then(r => r.json())
  ])
  .then(([vehiculos, autos]) => {

    console.log("vehiculos:", vehiculos);
    console.log("autos:", autos);

    const contenedor = document.getElementById("vehiculoOpciones");
    const seleccionado = document.getElementById("vehiculoSeleccionado");
    const inputVehiculo = document.getElementById("vehiculoId");
    const vistaPrecio = document.getElementById("precio-vista");

    contenedor.innerHTML = "";

    vehiculos.forEach(v => {

      const disponibles = autos.filter(a =>
        a.vehiculo.vehiculo === v.vehiculo &&
        a.estado === "DISPONIBLE"
      ).length;

      if (disponibles === 0) return;

      const card = document.createElement("div");
      card.classList.add("vehiculo-opcion");
      card.dataset.id = v.vehiculo;

      card.innerHTML = `
        <img src='/Frontend/recursos/img/autos/car_${v.marca}_${v.model}.jpg'>
        <div class="info">
            <h3>${v.marca} ${v.model}</h3>
            <p>${v.year} • ${v.categoria ?? 'Vehículo'} • ${v.combustible}</p>
            <span>S/ ${v.precio} por día</span>
            <small>${disponibles} disponibles</small>
        </div>
      `;

      card.addEventListener("click", () => {

        document.querySelectorAll(".vehiculo-opcion")
          .forEach(el => el.classList.remove("activo"));

        card.classList.add("activo");

        seleccionado.innerHTML = `
          <div class="vehiculo-card">
            <div class="vehiculo_renderizar-img">
              ${card.innerHTML}
            </div>
          </div>
        `;


        inputVehiculo.value = v.vehiculo;

          vistaPrecio.textContent = v.precio;
        
      });

      contenedor.appendChild(card);
    });

  })
  .catch(err => console.error("Error:", err));
}