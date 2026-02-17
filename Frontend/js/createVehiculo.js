const URL_API = "http://localhost:9090/api/v12/vehiculos";
const btnCrear = document.querySelector("#btnCrear");

btnCrear.addEventListener("click", crearVehiculo);

function crearVehiculo() {

  const imagenInput = document.querySelector("#inputImagen");
  const imagen = imagenInput.files[0];

  const vehiculo = {
    marca: document.querySelector("#inputMarca").value.trim(),
    model: document.querySelector("#inputModelo").value.trim(),
    version: document.querySelector("#inputVersion").value.trim(),
    year: parseInt(document.querySelector("#inputYear").value),
    categoria: document.querySelector("#categoria").value,
    carroceria: document.querySelector("#inputCarroceria").value.trim(),
    combustible: document.querySelector("#inputCombustible").value,
    descripcion: document.querySelector("#inputDescripcion").value.trim(),
    precio: parseFloat(document.querySelector("#inputPrecio").value)
  };

  if (!vehiculo.marca || !vehiculo.model || !vehiculo.year || !vehiculo.precio) {
    alert("Completa los campos obligatorios");
    return;
  }


  const formData = new FormData();


  formData.append(
    "vehiculo",
    new Blob([JSON.stringify(vehiculo)], { type: "application/json" })
  );


  if (imagen) {
    formData.append("imagen", imagen);
  }

  fetch(URL_API, {
    method: "POST",
    body: formData
  })
    .then(res => {
      if (!res.ok) throw new Error("Error al crear vehiculo");
      return res.json();
    })
    .then(() => {
      alert("vehiculo creado correctamente");
      window.location.href = "/Frontend/html/admin/Vehiculos.html";
    })
    .catch(err => {
      console.error(err);
      alert("Error al crear el vehiculo");
    });
}


function limpiarFormulario() {
  document.querySelector("form").reset();
  document.querySelector("#previewImg").src = "/Frontend/recursos/img/autos/item_null.png";

  document.querySelector("#displayMarca").textContent = "MARCA";
  document.querySelector("#displayModelo").textContent = "MODELO";
  document.querySelector("#displayYear").textContent = "AÑO";
}

