const API_BASE = 'http://localhost:9090/api';


        function mostrarError(msg) {
            const err = document.getElementById('mensaje-error');
            const ok  = document.getElementById('mensaje-exito');
            ok.style.display = 'none';
            err.textContent = msg;
            err.style.display = 'block';
            err.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        function mostrarExito(msg) {
            const err = document.getElementById('mensaje-error');
            const ok  = document.getElementById('mensaje-exito');
            err.style.display = 'none';
            ok.textContent = msg;
            ok.style.display = 'block';
            ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        function setLoading(on) {
            const btn = document.getElementById('btn-registro');
            btn.disabled = on;
            btn.innerHTML = on
                ? '<span class="spinner"></span>CREANDO CUENTA...'
                : 'CREAR CUENTA';
        }

        function validarFormulario(datos) {
            if (!datos.nombres || !datos.apellidos) {
                mostrarError('El nombre y apellido son obligatorios.');
                return false;
            }
            if (!datos.documento || datos.documento.length < 8) {
                mostrarError('Ingresa un número de documento válido (mínimo 8 dígitos).');
                return false;
            }
            if (!datos.telefono || datos.telefono.length !== 9) {
                mostrarError('El teléfono debe tener exactamente 9 dígitos.');
                return false;
            }
            if (!datos.licencia) {
                mostrarError('El número de licencia es obligatorio.');
                return false;
            }
            const vencimiento = document.getElementById('licencia-vencimiento').value;
            if (vencimiento && new Date(vencimiento) < new Date()) {
                mostrarError('La licencia de conducir está vencida.');
                return false;
            }
            if (!datos.email) {
                mostrarError('El correo electrónico es obligatorio.');
                return false;
            }
            if (datos.password.length < 6) {
                mostrarError('La contraseña debe tener al menos 6 caracteres.');
                return false;
            }
            const confirmPassword = document.getElementById('confirm-password').value;
            if (datos.password !== confirmPassword) {
                mostrarError('Las contraseñas no coinciden.');
                return false;
            }
            if (!document.getElementById('terminos').checked) {
                mostrarError('Debes aceptar los términos y condiciones.');
                return false;
            }
            return true;
        }

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
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });

                const data = await res.json();

                if (res.ok && data.exito) {
                    mostrarExito('¡Cuenta creada exitosamente! Redirigiendo al inicio de sesión...');

                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 2000);

                } else {
                    mostrarError(data.mensaje || 'No se pudo crear la cuenta. Intenta de nuevo.');
                }

            } catch (err) {
                console.error(err);
                mostrarError('No se pudo conectar con el servidor. Verifica tu conexión.');
            } finally {
                setLoading(false);
            }

        });



