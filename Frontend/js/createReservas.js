const URL_API = "http://localhost:9090/api/v12/reservas";
const btnCrear = document.querySelector("#btnCrear");

btnCrear.addEventListener("click", crearReserva);


let listaAutos = [];

fetch("http://localhost:9090/api/v12/autos")
  .then(res => res.json())
  .then(data => listaAutos = data);

function obtenerAutoAleatorioPorVehiculo(idVehiculo) {

  const autosDisponibles = listaAutos.filter(a =>
    a.vehiculo.vehiculo === Number(idVehiculo) &&
    a.estado === "DISPONIBLE"
  );

  if (autosDisponibles.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * autosDisponibles.length);

  return autosDisponibles[randomIndex].auto;
}

function FechaFormatoLocalDateTime(fecha){
  if (!fecha) return null;

  return fecha + "T10:00:00";
}

function crearReserva() {

  const vehiculoId = document.getElementById("vehiculoId").value;
  const autoId = obtenerAutoAleatorioPorVehiculo(vehiculoId);

  const reserva = {

    //usuario: document.getElementById("buscarCliente").value,
     

    nombres: document.getElementById("inputNombres").value,
    email: document.getElementById("inputEmail").value,
    telefono: document.getElementById("inputTelefono").value,
    dni: document.getElementById("inputDni").value,

    idVehiculo: Number(vehiculoId),
    idAuto: Number(autoId),

    fecha_inicio: FechaFormatoLocalDateTime(document.getElementById("fechaInicio").value),
    fecha_fin: FechaFormatoLocalDateTime(document.getElementById("fechaFin").value),

  };
  console.log("nombres:", (document.getElementById("inputNombres").value));
  console.log("email:", (document.getElementById("inputEmail").value));
  console.log("telefono:", (document.getElementById("inputTelefono").value));
  console.log("dni:", (document.getElementById("inputDni").value));
  console.log("idVehiculo:", (Number(vehiculoId)));
  console.log("idAuto:", (Number(autoId)));
  console.log("fecha_inicio:", (FechaFormatoLocalDateTime(document.getElementById("fechaInicio").value)));
  console.log("fecha_fin:", (FechaFormatoLocalDateTime(document.getElementById("fechaFin").value)));

  if (!reserva.nombres || !reserva.email || !reserva.telefono || !reserva.dni || !reserva.idVehiculo || !reserva.idAuto || !reserva.fecha_inicio || !reserva.fecha_fin) {
    alert("Completa los campos obligatorios");
    return;
  }
  console.log(JSON.stringify(reserva, null, 2));
  console.log(reserva);
 






  fetch(URL_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(reserva)
  })
  .then(res => res.json())
  .then(data => {
    alert("Reserva creada");
    console.log(data);
  })
  .catch(err => console.error("Error:", err));
}

