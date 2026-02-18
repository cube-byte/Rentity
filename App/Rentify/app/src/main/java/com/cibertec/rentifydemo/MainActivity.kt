package com.cibertec.rentifydemo

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import android.widget.Button
import android.widget.EditText
import com.google.android.material.textfield.TextInputLayout
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.button.MaterialButton
import android.widget.Toast




class MainActivity : AppCompatActivity() {

    private lateinit var etEmail: TextInputEditText
    private lateinit var etPassword: TextInputEditText
    private lateinit var tilEmail: TextInputLayout
    private lateinit var tilPassword: TextInputLayout
    private lateinit var btnLogin: MaterialButton


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)



        etEmail = findViewById(R.id.etEmail)
        etPassword = findViewById(R.id.etPassword)
        tilEmail = findViewById(R.id.tilEmail)
        tilPassword = findViewById(R.id.tilPassword)
        btnLogin = findViewById(R.id.btnLogin)

        btnLogin.setOnClickListener {
            validarCampos()
        }
    }

    private fun validarCampos() {
        val email = etEmail.text.toString().trim()
        val password = etPassword.text.toString().trim()

        var valido = true

        // Validar Email
        if (!email.contains("@") || !email.contains(".")) {
            tilEmail.error = "Correo inválido"
            valido = false
        } else {
            tilEmail.error = null
        }

        // Validar Password
        if (password.length < 6) {
            tilPassword.error = "Mínimo 6 caracteres"
            valido = false
        } else {
            tilPassword.error = null
        }

        if (valido) {
            Toast.makeText(this, "Datos válidos", Toast.LENGTH_SHORT).show()
        }

    }
}