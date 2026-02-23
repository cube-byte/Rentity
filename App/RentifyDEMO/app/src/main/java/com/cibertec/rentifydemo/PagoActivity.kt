package com.cibertec.rentifydemo

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.ImageButton
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.launch

class PagoActivity : AppCompatActivity() {

    private var pagoId    = 0L
    private var idReserva = 0L
    private var autoNombre   = ""
    private var fechaInicio  = ""
    private var fechaFin     = ""
    private var monto        = 0.0

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_pago)

        pagoId    = intent.getLongExtra("pago_id", 0L)
        idReserva = intent.getLongExtra("reserva_id", 0L)
        monto       = intent.getDoubleExtra("reserva_precio", 0.0)
        autoNombre  = intent.getStringExtra("auto_nombre") ?: ""
        fechaInicio = intent.getStringExtra("fecha_inicio") ?: ""
        fechaFin    = intent.getStringExtra("fecha_fin") ?: ""

        findViewById<TextView>(R.id.tvMontoPago).text = "Total: $$monto"

        findViewById<ImageButton>(R.id.btnVolverPago).setOnClickListener {
            mostrarDialogoCancelar()
        }

        val etNumero    = findViewById<EditText>(R.id.etNumeroTarjeta)
        val etNombre    = findViewById<EditText>(R.id.etNombreTarjeta)
        val etVence     = findViewById<EditText>(R.id.etVencimiento)
        val etCvv       = findViewById<EditText>(R.id.etCvv)
        val progressBar = findViewById<ProgressBar>(R.id.progressBarPago)

        findViewById<Button>(R.id.btnPagar).setOnClickListener {
            val numero = etNumero.text.toString().trim()
            val nombre = etNombre.text.toString().trim()
            val vence  = etVence.text.toString().trim()
            val cvv    = etCvv.text.toString().trim()

            if (numero.length < 16) {
                etNumero.error = "El número debe tener 16 dígitos"
                return@setOnClickListener
            }
            if (nombre.isEmpty() || nombre.any { it.isDigit() }) {
                etNombre.error = "El nombre no debe contener números"
                return@setOnClickListener
            }
            if (vence.length < 5 || !vence.contains("/")) {
                etVence.error = "Formato inválido, usa MM/AA (ej: 12/27)"
                return@setOnClickListener
            }

// Validar mes y año
            val partes = vence.split("/")
            val mes = partes[0].toIntOrNull()
            val anio = partes[1].toIntOrNull()
            val anioActual = java.util.Calendar.getInstance().get(java.util.Calendar.YEAR) % 100
            val mesActual = java.util.Calendar.getInstance().get(java.util.Calendar.MONTH) + 1

            if (mes == null || mes < 1 || mes > 12) {
                etVence.error = "El mes no es válido (01-12)"
                return@setOnClickListener
            }
            if (anio == null || anio < anioActual || (anio == anioActual && mes < mesActual)) {
                etVence.error = "La tarjeta está vencida"
                return@setOnClickListener
            }

            if (cvv.length < 3) {
                etCvv.error = "El CVV debe tener 3 dígitos"
                return@setOnClickListener
            }

            lifecycleScope.launch {
                try {
                    progressBar.visibility = View.VISIBLE
                    val response = RetrofitInstance.api.completarPago(pagoId, PagoConfirmarRequest("TARJETA"))
                    if (response.isSuccessful) {
                        Toast.makeText(this@PagoActivity, "¡Pago realizado con éxito!", Toast.LENGTH_LONG).show()
                        val intent = Intent(this@PagoActivity, PagoExitosoActivity::class.java)
                        intent.putExtra("auto_nombre",    autoNombre)
                        intent.putExtra("fecha_inicio",   fechaInicio.take(10))
                        intent.putExtra("fecha_fin",      fechaFin.take(10))
                        intent.putExtra("monto",          monto)
                        intent.putExtra("reserva_id",     idReserva)
                        intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP
                        startActivity(intent)
                        finish()
                    } else {
                        Toast.makeText(this@PagoActivity, "Error al procesar el pago", Toast.LENGTH_SHORT).show()
                    }
                } catch (e: Exception) {
                    Toast.makeText(this@PagoActivity, "Error: ${e.message}", Toast.LENGTH_LONG).show()
                } finally {
                    progressBar.visibility = View.GONE
                }
            }
        }
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        mostrarDialogoCancelar()
    }

    private fun mostrarDialogoCancelar() {
        AlertDialog.Builder(this)
            .setTitle("¿Cancelar el pago?")
            .setMessage("Si vuelves atrás la reserva será cancelada automáticamente.")
            .setPositiveButton("Sí, cancelar") { _, _ ->
                lifecycleScope.launch {
                    try {
                        RetrofitInstance.api.cancelarReserva(idReserva)
                    } catch (e: Exception) {
                        // ignorar
                    } finally {
                        finish()
                    }
                }
            }
            .setNegativeButton("Seguir pagando", null)
            .show()
    }
}