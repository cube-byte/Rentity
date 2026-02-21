const URL_API = "http://localhost:9090/api/v12/vehiculos";

/* =========================
   OBTENER ID
========================= */
const params = new URLSearchParams(window.location.search);
const idVehiculo = params.get("id");

if (!idVehiculo) {
  alert("No se recibió el ID del vehículo");
  throw new Error("ID del vehículo no encontrado");
}

console.log("ID DEL VEHÍCULO:", idVehiculo);

/* =========================
   INICIAR
========================= */
document.addEventListener("DOMContentLoaded", cargarVehiculo);

/* =========================
   CARGAR VEHÍCULO
========================= */
function cargarVehiculo() {
  fetch(`${URL_API}/${idVehiculo}`)
    .then(res => {
      if (!res.ok) throw new Error("Vehículo no encontrado");
      return res.json();
    })
    .then(vehiculo => mostrarVehiculo(vehiculo))
    .catch(err => {
      console.error(err);
      alert("No se pudo cargar el vehículo");
    });
}

/* =========================
   MOSTRAR DATOS DEL VEHÍCULO
========================= */
function mostrarVehiculo(vehiculo) {
  const cleanName = (str) => str.toLowerCase().replace(/\s+/g, "_");

  /* ---------- PRECIOS ---------- */
  const precioUSD = Number(vehiculo.precio) ?? 0;
  const precioPEN = precioUSD * 3.70;

  const usd = precioUSD.toLocaleString("en-US", { minimumFractionDigits: 2 });
  const pen = precioPEN.toLocaleString("es-PE", { minimumFractionDigits: 2 });

  /* ---------- TEXTO ---------- */
  const setText = (selector, value) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = value ?? "N/A";
  };

  setText(".banner-texto h1", `${vehiculo.marca} ${vehiculo.model}`);
  setText("#modelo", vehiculo.model);
  setText(".tagline", vehiculo.descripcion ?? "Muévete a tu mejor versión");
  setText("#precio", `S/ ${pen}`);
  setText("#categoria", vehiculo.categoria);
  setText("#year", vehiculo.year);
  setText("#precioUSD", `$ ${usd}`);
  setText("#precioPEN", `S/ ${pen}`);
  setText("#carroceria", vehiculo.carroceria);
  setText("#combustible", vehiculo.combustible);

  /* ---------- IMÁGENES ---------- */
  const imagesMap = [
    {
      selector: ".banner-hero img",
      src: `/Frontend/recursos/img/banner/banner_${cleanName(vehiculo.marca)}_${cleanName(vehiculo.model)}.jpg`,
      fallback: "/Frontend/recursos/img/banner/decorations/banner_null.jpg"
    },
    {
      selector: ".auto-visual img",
      src: `/Frontend/recursos/img/autos/car_${cleanName(vehiculo.marca)}_${cleanName(vehiculo.model)}.jpg`,
      fallback: "/Frontend/recursos/img/autos/car_default.jpg"
    },
    {
      selector: ".especificaciones-image img",
      src: `/Frontend/recursos/img/autos/details_${cleanName(vehiculo.marca)}_${cleanName(vehiculo.model)}.png`,
      fallback: `/Frontend/recursos/img/autos/car_${cleanName(vehiculo.marca)}_${cleanName(vehiculo.model)}.jpg`
    }
  ];

    imagesMap.forEach(imgInfo => {
      document.querySelectorAll(imgInfo.selector).forEach(img => {
        img.src = imgInfo.src;

        img.onerror = function () {
          this.onerror = null;          
          this.src = imgInfo.fallback;
        };
      });
    });
}

// ── CERRAR SESIÓN ─────────────────────────────
document.getElementById('btn-cerrar-sesion').addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('rentify_usuario');
    window.location.href = '../../html/login.html';
});

// ── PERFIL ────────────────────────────────────
const _u = JSON.parse(localStorage.getItem('rentify_usuario') || '{}');
if (_u.email) document.getElementById('perfilEmail').textContent = _u.email;
if (_u.rol)   document.getElementById('perfilRol').textContent   = _u.rol;