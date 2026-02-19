// ══════════════════════════════════════════════
//  login.js  –  Rentify
// ══════════════════════════════════════════════

const API_BASE = 'http://localhost:9090/api';

const RUTAS = {
    ADMINISTRADOR: 'admin/Dashboard.html',
    CLIENTE:       'user/Catalogo.html'
};

// ── HELPERS DE VALIDACIÓN INLINE ─────────────

function mostrarErrorCampo(id, mensaje) {
    const input = document.getElementById(id);
    if (!input) return;
    input.classList.add('input-error');
    input.classList.remove('input-ok');
    let err = input.parentElement.querySelector('.field-error');
    if (!err) {
        err = document.createElement('span');
        err.className = 'field-error';
        input.parentElement.appendChild(err);
    }
    err.textContent = mensaje;
}

function limpiarErrorCampo(id) {
    const input = document.getElementById(id);
    if (!input) return;
    input.classList.remove('input-error');
    input.classList.add('input-ok');
    const err = input.parentElement.querySelector('.field-error');
    if (err) err.remove();
}

// Limpiar errores al escribir
document.addEventListener('DOMContentLoaded', () => {
    ['email', 'password'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', () => {
            limpiarErrorCampo(id);
            // Ocultar banner general al corregir
            document.getElementById('mensaje-error').style.display = 'none';
        });
    });
});

// ── HELPERS UI (banner general) ──────────────

function mostrarError(msg) {
    const err = document.getElementById('mensaje-error');
    const ok  = document.getElementById('mensaje-exito');
    ok.style.display  = 'none';
    err.textContent   = msg;
    err.style.display = 'block';
}

function mostrarExito(msg) {
    const err = document.getElementById('mensaje-error');
    const ok  = document.getElementById('mensaje-exito');
    err.style.display = 'none';
    ok.textContent    = msg;
    ok.style.display  = 'block';
}

function setLoading(on) {
    const btn = document.getElementById('btn-login');
    btn.disabled  = on;
    btn.innerHTML = on
        ? '<span class="spinner"></span>INGRESANDO...'
        : 'INGRESAR';
}

// ── SUBMIT ────────────────────────────────────

document.querySelector('.login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Validación inline por campo
    let valido = true;

    if (!email) {
        mostrarErrorCampo('email', 'El correo es obligatorio');
        valido = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        mostrarErrorCampo('email', 'Ingresa un correo válido');
        valido = false;
    }

    if (!password) {
        mostrarErrorCampo('password', 'La contraseña es obligatoria');
        valido = false;
    }

    if (!valido) return;

    setLoading(true);

    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok && data.exito) {
            localStorage.setItem('rentify_usuario', JSON.stringify({
                id:        data.id,
                nombres:   data.nombres,
                apellidos: data.apellidos,
                email:     data.email,
                rol:       data.rol
            }));

            mostrarExito(data.mensaje || '¡Bienvenido!');

            setTimeout(() => {
                window.location.href = RUTAS[data.rol] || RUTAS.CLIENTE;
            }, 800);

        } else {
            // Error del servidor: mostrar bajo el campo email
            mostrarErrorCampo('email', data.mensaje || 'Email o contraseña incorrectos.');
        }

    } catch (err) {
        console.error(err);
        mostrarError('No se pudo conectar con el servidor. Verifica tu conexión.');
    } finally {
        setLoading(false);
    }
});

// ── Sesión activa → redirigir ─────────────────

window.addEventListener('DOMContentLoaded', () => {
    const raw = localStorage.getItem('rentify_usuario');
    if (raw) {
        const u = JSON.parse(raw);
        window.location.href = RUTAS[u.rol] || RUTAS.CLIENTE;
    }
});