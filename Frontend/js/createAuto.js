const URL_API = "http://localhost:9090/api/v12/autos";
const btnCrear = document.querySelector("#btnCrearAuto");

btnCrear.addEventListener("click", crearAuto);

function crearAuto() {

  const auto = {
    placa: document.getElementById("inputPlaca").value,
    vehiculo: document.getElementById("selectVehiculo").value,
    color: document.getElementById("inputColor").value,
    kilometraje: document.getElementById("inputKilometraje").value,
    ubicacion: document.getElementById("inputUbicacion").value
  };

  if (!auto.placa || !auto.vehiculo || !auto.color || !auto.kilometraje) {
    alert("Completa los campos obligatorios");
    return;
  }

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
  })
  .catch(err => {
    console.error(err);
    alert("No se pudo crear");
  });
}