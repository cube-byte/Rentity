

        const API_BASE = 'http://localhost:9090/api';

        const RUTAS = {
            ADMINISTRADOR: 'admin/Dashboard.html',
            CLIENTE:       'user/Catalogo.html'
        };

        // ─── HELPERS UI ──────────────────────────────────────────────────────────────
        function mostrarError(msg) {
            const err = document.getElementById('mensaje-error');
            const ok  = document.getElementById('mensaje-exito');
            ok.style.display = 'none';
            err.textContent = msg;
            err.style.display = 'block';
        }

        function mostrarExito(msg) {
            const err = document.getElementById('mensaje-error');
            const ok  = document.getElementById('mensaje-exito');
            err.style.display = 'none';
            ok.textContent = msg;
            ok.style.display = 'block';
        }

        function setLoading(on) {
            const btn = document.getElementById('btn-login');
            btn.disabled = on;
            btn.innerHTML = on
                ? '<span class="spinner"></span>INGRESANDO...'
                : 'INGRESAR';
        }

        // ─── SUBMIT ──────────────────────────────────────────────────────────────────
        document.querySelector('.login-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            const email    = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            if (!email || !password) {
                mostrarError('Por favor completa todos los campos.');
                return;
            }

            setLoading(true);

            try {
                const res = await fetch(`${API_BASE}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
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
                    mostrarError(data.mensaje || 'Email o contraseña incorrectos.');
                }

            } catch (err) {
                console.error(err);
                mostrarError('No se pudo conectar con el servidor. Verifica tu conexión.');
            } finally {
                setLoading(false);
            }
        });

        // ─── Si ya hay sesión activa, redirigir directamente ─────────────────────────

        window.addEventListener('DOMContentLoaded', () => {
    const raw = localStorage.getItem('rentify_usuario');
    if (raw) {
        const u = JSON.parse(raw);
        window.location.href = RUTAS[u.rol] || RUTAS.CLIENTE;
    }
});

