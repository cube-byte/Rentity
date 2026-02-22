package com.cibertec.rentifydemo

import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.button.MaterialButton
import android.content.Intent
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.launch


class MainActivity : AppCompatActivity() {

    private lateinit var etEmail: EditText
    private lateinit var etPassword: EditText
    private lateinit var btnLogin: MaterialButton

    private lateinit var tvRegister: TextView


    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        etEmail = findViewById(R.id.etEmail)
        etPassword = findViewById(R.id.etPassword)
        btnLogin = findViewById(R.id.btnLogin)
        tvRegister = findViewById(R.id.tvRegister)

        btnLogin.setOnClickListener {
            validarCampos()
        }

        tvRegister.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }


    }


    private fun validarCampos() {

        val email = etEmail.text.toString().trim()
        val password = etPassword.text.toString().trim()

        if (email.isEmpty()) {
            etEmail.error = getString(R.string.error_email)
            return
        }

        if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            etEmail.error = getString(R.string.error_email)
            return
        }

        if (password.isEmpty()) {
            etPassword.error = getString(R.string.error_password)
            return
        }

        if (password.length < 6) {
            etPassword.error = getString(R.string.error_password)
            return
        }

        // AQUÍ VA EL LOGIN REAL
        val request = LoginRequest(email, password)

        lifecycleScope.launch {
            try {
                val response = RetrofitInstance.api.login(request)

                if (response.isSuccessful && response.body()?.exito == true) {
                    Toast.makeText(
                        this@MainActivity,
                        response.body()?.mensaje,
                        Toast.LENGTH_SHORT
                    ).show()

                    val intent = Intent(this@MainActivity, HomeActivity::class.java)
                    val body = response.body()
                    intent.putExtra("usuario_nombre",   body?.nombres ?: "")
                    intent.putExtra("usuario_apellido", body?.apellidos ?: "")
                    intent.putExtra("usuario_email",    body?.email ?: "")
                    intent.putExtra("usuario_rol",      body?.rol ?: "")
                    intent.putExtra("usuario_id",       body?.id ?: 0L)
                    startActivity(intent)
                    finish()

                } else {
                    Toast.makeText(
                        this@MainActivity,
                        response.body()?.mensaje ?: "Credenciales incorrectas",
                        Toast.LENGTH_SHORT
                    ).show()
                }

            } catch (e: Exception) {
                Toast.makeText(
                    this@MainActivity,
                    "Error de conexión",
                    Toast.LENGTH_SHORT
                ).show()
            }
        }
    }



}

