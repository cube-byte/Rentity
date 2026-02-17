const URL_LOCATE = "http://localhost:9090/api/v12/ubicaciones";

document.addEventListener("DOMContentLoaded", () => {
  cargarUbicacion();
});

function cargarUbicacion() {
  fetch(URL_LOCATE)
    .then(res => res.json())
    .then(data => {
      const select = document.getElementById("selectUbicacion");

      select.innerHTML = `<option value="">Seleccione ubicacion</option>`;

      data.forEach(u => {
        const option = document.createElement("option");

        option.textContent = u.nombre;
        option.value = u.id;

        select.appendChild(option);
      });
    })
    .catch(err => console.error("Error cargando ubicacion:", err));
}