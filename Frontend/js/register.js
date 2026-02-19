// ══════════════════════════════════════════════
//  register.js  –  Rentify
// ══════════════════════════════════════════════

const API_BASE = 'http://localhost:9090/api';

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

// Limpiar error al escribir en cada campo
document.addEventListener('DOMContentLoaded', () => {
    ['nombres','apellidos','tipo-documento','documento','telefono',
     'licencia','licencia-vencimiento','email','password','confirm-password'
    ].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input',  () => limpiarErrorCampo(id));
        el.addEventListener('change', () => limpiarErrorCampo(id));
    });
});

// ── HELPERS UI (banners generales) ───────────

function mostrarError(msg) {
    const err = document.getElementById('mensaje-error');
    const ok  = document.getElementById('mensaje-exito');
    ok.style.display  = 'none';
    err.textContent   = msg;
    err.style.display = 'block';
    err.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function mostrarExito(msg) {
    const err = document.getElementById('mensaje-error');
    const ok  = document.getElementById('mensaje-exito');
    err.style.display = 'none';
    ok.textContent    = msg;
    ok.style.display  = 'block';
    ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function setLoading(on) {
    const btn = document.getElementById('btn-registro');
    btn.disabled  = on;
    btn.innerHTML = on
        ? '<span class="spinner"></span>CREANDO CUENTA...'
        : 'CREAR CUENTA';
}

// ── VALIDACIÓN INLINE POR CAMPO ───────────────

function validarFormulario(datos) {
    let valido = true;

    // Nombres
    if (!datos.nombres) {
        mostrarErrorCampo('nombres', 'El nombre es obligatorio');
        valido = false;
    }

    // Apellidos
    if (!datos.apellidos) {
        mostrarErrorCampo('apellidos', 'Los apellidos son obligatorios');
        valido = false;
    }

    // Documento
    if (!datos.documento) {
        mostrarErrorCampo('documento', 'El número de documento es obligatorio');
        valido = false;
    } else if (datos.documento.length < 8) {
        mostrarErrorCampo('documento', 'Mínimo 8 dígitos');
        valido = false;
    }

    // Teléfono
    if (!datos.telefono) {
        mostrarErrorCampo('telefono', 'El teléfono es obligatorio');
        valido = false;
    } else if (datos.telefono.length !== 9) {
        mostrarErrorCampo('telefono', 'Debe tener exactamente 9 dígitos');
        valido = false;
    }

    // Licencia
    if (!datos.licencia) {
        mostrarErrorCampo('licencia', 'El número de licencia es obligatorio');
        valido = false;
    }

    // Vencimiento de licencia
    const vencimiento = document.getElementById('licencia-vencimiento').value;
    if (vencimiento && new Date(vencimiento) < new Date()) {
        mostrarErrorCampo('licencia-vencimiento', 'La licencia de conducir está vencida');
        valido = false;
    }

    // Email
    if (!datos.email) {
        mostrarErrorCampo('email', 'El correo electrónico es obligatorio');
        valido = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.email)) {
        mostrarErrorCampo('email', 'Ingresa un correo válido');
        valido = false;
    }

    // Contraseña
    if (!datos.password) {
        mostrarErrorCampo('password', 'La contraseña es obligatoria');
        valido = false;
    } else if (datos.password.length < 6) {
        mostrarErrorCampo('password', 'Mínimo 6 caracteres');
        valido = false;
    }

    // Confirmar contraseña
    const confirmPassword = document.getElementById('confirm-password').value;
    if (!confirmPassword) {
        mostrarErrorCampo('confirm-password', 'Confirma tu contraseña');
        valido = false;
    } else if (datos.password !== confirmPassword) {
        mostrarErrorCampo('confirm-password', 'Las contraseñas no coinciden');
        valido = false;
    }

    // Términos
    if (!document.getElementById('terminos').checked) {
        mostrarErrorCampo('terminos', 'Debes aceptar los términos y condiciones');
        valido = false;
    }

    return valido;
}

// ── SUBMIT ────────────────────────────────────

document.querySelector('.register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const datos = {
        nombres:   document.getElementById('nombres').value.trim(),
        apellidos: document.getElementById('apellidos').value.trim(),
        documento: document.getElementById('documento').value.trim(),
        telefono:  document.getElementById('telefono').value.trim(),
        licencia:  document.getElementById('licencia').value.trim(),
        email:     document.getElementById('email').value.trim(),
        password:  document.getElementById('password').value,
        rol:       'CLIENTE'
    };

    if (!validarFormulario(datos)) return;

    setLoading(true);

    try {
        const res = await fetch(`${API_BASE}/auth/registro`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(datos)
        });

        const data = await res.json();

        if (res.ok && data.exito) {
            mostrarExito('¡Cuenta creada exitosamente! Redirigiendo al inicio de sesión...');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);

        } else {
            // Error del servidor (ej. email ya registrado) → bajo el campo email
            mostrarErrorCampo('email', data.mensaje || 'No se pudo crear la cuenta. Intenta de nuevo.');
        }

    } catch (err) {
        console.error(err);
        mostrarError('No se pudo conectar con el servidor. Verifica tu conexión.');
    } finally {
        setLoading(false);
    }
});