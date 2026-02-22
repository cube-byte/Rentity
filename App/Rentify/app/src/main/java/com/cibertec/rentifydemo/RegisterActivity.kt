package com.cibertec.rentifydemo

import android.os.Bundle
import android.widget.ImageView
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.textfield.TextInputLayout
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.button.MaterialButton
import android.widget.Toast
import com.google.android.material.tabs.TabLayout
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.launch

class RegisterActivity : AppCompatActivity() {

    private lateinit var etNombres: TextInputEditText
    private lateinit var etApellidos: TextInputEditText
    private lateinit var etDocumento: TextInputEditText
    private lateinit var etLicencia: TextInputEditText
    private lateinit var etTelefono: TextInputEditText
    private lateinit var etEmail: TextInputEditText
    private lateinit var etPassword: TextInputEditText

    private lateinit var tilNombres: TextInputLayout
    private lateinit var tilApellidos: TextInputLayout
    private lateinit var tilDocumento: TextInputLayout
    private lateinit var tilLicencia: TextInputLayout
    private lateinit var tilTelefono: TextInputLayout
    private lateinit var tilEmail: TextInputLayout
    private lateinit var tilPassword: TextInputLayout

    private lateinit var btnRegister: MaterialButton
    private lateinit var btnBack: ImageView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        // Inicializar EditTexts
        etNombres = findViewById(R.id.etNombres)
        etApellidos = findViewById(R.id.etApellidos)
        etDocumento = findViewById(R.id.etDocumento)
        etLicencia = findViewById(R.id.etLicencia)
        etTelefono = findViewById(R.id.etTelefono)
        etEmail = findViewById(R.id.etEmail)
        etPassword = findViewById(R.id.etPassword)

        // Inicializar TextInputLayouts
        tilNombres = findViewById(R.id.tilNombres)
        tilApellidos = findViewById(R.id.tilApellidos)
        tilDocumento = findViewById(R.id.tilDocumento)
        tilLicencia = findViewById(R.id.tilLicencia)
        tilTelefono = findViewById(R.id.tilTelefono)
        tilEmail = findViewById(R.id.tilEmail)
        tilPassword = findViewById(R.id.tilPassword)

        btnRegister = findViewById(R.id.btnRegister)
        btnBack = findViewById(R.id.btnBack)

        btnRegister.setOnClickListener {
            validarCampos()
        }

        btnBack.setOnClickListener {
            finish()
        }

        val tabLayout = findViewById<TabLayout>(R.id.tabLayout)
        tabLayout.getTabAt(0)?.select()

        tabLayout.addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
            override fun onTabSelected(tab: TabLayout.Tab?) {
                if (tab?.position == 1) {
                    finish()
                }
            }
            override fun onTabUnselected(tab: TabLayout.Tab?) {}
            override fun onTabReselected(tab: TabLayout.Tab?) {}
        })
    }

    private fun validarCampos() {
        val nombres = etNombres.text.toString().trim()
        val apellidos = etApellidos.text.toString().trim()
        val documento = etDocumento.text.toString().trim()
        val licencia = etLicencia.text.toString().trim()
        val telefono = etTelefono.text.toString().trim()
        val email = etEmail.text.toString().trim()
        val password = etPassword.text.toString().trim()

        var valido = true

        // Validar Nombres
        if (nombres.isEmpty()) {
            tilNombres.error = "Ingrese sus nombres"
            valido = false
        } else {
            tilNombres.error = null
        }

        // Validar Apellidos
        if (apellidos.isEmpty()) {
            tilApellidos.error = "Ingrese sus apellidos"
            valido = false
        } else {
            tilApellidos.error = null
        }

        // Validar Documento
        if (documento.isEmpty()) {
            tilDocumento.error = "Ingrese su documento"
            valido = false
        } else if (documento.length < 8) {
            tilDocumento.error = "Documento inválido (mínimo 8 dígitos)"
            valido = false
        } else {
            tilDocumento.error = null
        }

        // Validar Licencia
        if (licencia.isEmpty()) {
            tilLicencia.error = "Ingrese su licencia"
            valido = false
        } else {
            tilLicencia.error = null
        }

        // Validar Teléfono
        if (telefono.isEmpty()) {
            tilTelefono.error = "Ingrese su teléfono"
            valido = false
        } else if (telefono.length != 9) {
            tilTelefono.error = "Teléfono debe tener 9 dígitos"
            valido = false
        } else {
            tilTelefono.error = null
        }

        // Validar Email
        if (email.isEmpty()) {
            tilEmail.error = "Ingrese su email"
            valido = false
        } else if (!email.contains("@") || !email.contains(".")) {
            tilEmail.error = "Correo inválido"
            valido = false
        } else {
            tilEmail.error = null
        }

        // Validar Password
        if (password.isEmpty()) {
            tilPassword.error = "Ingrese su contraseña"
            valido = false
        } else if (password.length < 6) {
            tilPassword.error = "Mínimo 6 caracteres"
            valido = false
        } else {
            tilPassword.error = null
        }

        if (valido) {
            registrarUsuario(nombres, apellidos, documento, licencia, telefono, email, password)
        }
    }

    private fun registrarUsuario(
        nombres: String,
        apellidos: String,
        documento: String,
        licencia: String,
        telefono: String,
        email: String,
        password: String
    ) {
        val request = RegisterRequest(
            nombres = nombres,
            apellidos = apellidos,
            documento = documento,
            licencia = licencia,
            telefono = telefono,
            email = email,
            password = password,
            rol = "CLIENTE"
        )

        lifecycleScope.launch {
            try {
                val response = RetrofitInstance.api.registro(request)

                if (response.isSuccessful && response.body()?.exito == true) {
                    Toast.makeText(
                        this@RegisterActivity,
                        "Registro exitoso",
                        Toast.LENGTH_SHORT
                    ).show()
                    finish()
                } else {
                    val mensaje = response.body()?.mensaje ?: "Error al registrar"
                    Toast.makeText(
                        this@RegisterActivity,
                        mensaje,
                        Toast.LENGTH_LONG
                    ).show()
                }

            } catch (e: Exception) {
                e.printStackTrace() // Para ver el error en Logcat
                Toast.makeText(
                    this@RegisterActivity,
                    "Error de conexión: ${e.message}",
                    Toast.LENGTH_LONG
                ).show()
            }
        }
    }
}