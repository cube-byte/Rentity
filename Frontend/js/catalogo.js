const URL_API = "http://localhost:9090/api/v12/vehiculos";
const contenedor = document.querySelector("#lista-catalogo");
const recomendacion = document.querySelector("#catalog-recomendation");

let autos = [];
let autosFiltrados = [];

/* ======================
   CARGA INICIAL
====================== */
document.addEventListener("DOMContentLoaded", () => {
  fetch(URL_API)
    .then(res => res.json())
    .then(data => {
      autos = data;
      autosFiltrados = [...autos];

      generarFiltros();
      pintarVehiculos(autosFiltrados);
      pintarVehiculoRecomendado(autosFiltrados);
    })
    .catch(err => console.error("Error:", err));
});

/* ======================
   GENERAR FILTROS
====================== */
function generarFiltros() {
  generarCheckbox("MARCAS", "marca", autos.map(a => a.marca));
  generarCheckbox("AÑO", "year", autos.map(a => a.year));
  generarCheckbox("CATEGORIA", "categoria", autos.map(a => a.categoria));
  generarCheckbox("CARROCERÍA", "carroceria", autos.map(a => a.carroceria));
  generarCheckbox("COMBUSTIBLE", "combustible", autos.map(a => a.combustible));
}

function generarCheckbox(seccionTexto, campo, valores) {
  const seccion = [...document.querySelectorAll(".filter-section")]
    .find(s => s.querySelector("span").textContent === seccionTexto);

  if (!seccion) return;

  const contenedor = seccion.querySelector(".filter-options");
  contenedor.innerHTML = "";

  const unicos = [...new Set(valores)];

  unicos.forEach(valor => {
    const count = autos.filter(a => a[campo] === valor).length;

    const div = document.createElement("div");
    div.classList.add("filter-option");

    div.innerHTML = `
      <input type="checkbox" value="${valor}" data-campo="${campo}">
      <label>${valor} <span class="filter-count">(${count})</span></label>
    `;

    contenedor.appendChild(div);
  });
}

/* ======================
   FILTRAR AUTOS
====================== */
function aplicarFiltros() {
  const checks = document.querySelectorAll(".filter-options input:checked");

  if (checks.length === 0) {
    autosFiltrados = [...autos];
    pintarAutos(autosFiltrados);
    return;
  }

  autosFiltrados = autos.filter(auto => {
    return [...checks].every(chk => {
      const campo = chk.dataset.campo;
      return auto[campo].toString() === chk.value;
    });
  });

  pintarAutos(autosFiltrados);
}

function limpiarFiltros() {
  document.querySelectorAll(".filter-options input").forEach(c => c.checked = false);
  autosFiltrados = [...autos];
  pintarAutos(autosFiltrados);
}

/* ======================
  AUTO RECOMENDATION
====================== */

function pintarVehiculoRecomendado(lista) {
  recomendacion.innerHTML = "";

  if (!lista || lista.length === 0) {
    recomendacion.innerHTML = "<p>No hay vehículos disponibles</p>";
    return;
  }

  // 👉 tomar el primero (puedes cambiar la lógica luego)
  const vehiculo = lista[0];

  const precioUSD = Number(vehiculo.precio);
  const precioPEN = precioUSD * 3.70;

  const card = document.createElement("div");
  card.classList.add("catalog-recomendation");

  card.innerHTML = `
    <div class="rec-car-image">
      <img src="/Frontend/recursos/img/autos/car_${vehiculo.marca}_${vehiculo.model}.jpg"
           onerror="this.src='/Frontend/recursos/img/autos/car_null.jpg'">
    </div>

    <div class="rec-car-info">
      <span class="badge-recomendado">RECOMENDADO</span>

      <h4 class="rec-marca">${vehiculo.marca}</h4>
      <h3 class="rec-modelo">${vehiculo.model}</h3>

      <div class="rec-precio">
        Desde <strong>US $${precioUSD.toLocaleString("en-US")}</strong><br>
        o <strong>S/ ${precioPEN.toLocaleString("es-PE")}</strong> por día
      </div>

      <div class="car-buttons">
          <a class="btn-primary btn-reservar" data-id="${vehiculo.vehiculo}">
            RESERVAR
          </a>
      </div>
    </div>
  `;

  recomendacion.appendChild(card);
}






/* ======================
   PINTAR AUTOS
====================== */
function pintarVehiculos(lista) {
  contenedor.innerHTML = "";

  lista.forEach(vehiculo => {
    const precioUSD = Number(vehiculo.precio);
    const precioPEN = precioUSD * 3.70;

    const card = document.createElement("div");
    card.classList.add("car-card");

    card.innerHTML = `
      <div class="car-image">
        <img src="/Frontend/recursos/img/autos/car_${vehiculo.marca}_${vehiculo.model}.jpg"
             onerror="this.src='/Frontend/recursos/img/autos/car_null.jpg'">
      </div>

      <div class="car-info">
        <h4 class="car-marca">${vehiculo.marca}</h4>
        <h3 class="car-modelo">${vehiculo.model}</h3>

        <div class="car-pricing">
          <div class="current-price">
            Desde US $${precioUSD.toLocaleString("en-US")} 
            o S/ ${precioPEN.toLocaleString("es-PE")} por dia
          </div>
        </div>

        <div class="car-buttons">
          <a class="button-v2 btn-primary" data-id="${vehiculo.vehiculo}">
            RESERVAR
          </a>
        </div>
      </div>
    `;

    contenedor.appendChild(card);
  });
}



/* ======================
   EVENTOS
====================== */
document.addEventListener("change", e => {
  if (e.target.matches(".filter-options input")) {
    aplicarFiltros();
  }
});

document.addEventListener("click", e => {
  const btn = e.target.closest(".btn-primary");
  if (!btn) return;

  const id = btn.dataset.id;
  window.location.href = `/Frontend/html/user/Detalle.html?id=${id}`;
});