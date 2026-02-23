package com.cibertec.rentifydemo

import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.ImageButton
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.launch

class DetalleReservaActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_detalle_reserva)

        val id          = intent.getLongExtra("reserva_id", 0L)
        val nombres     = intent.getStringExtra("reserva_nombres") ?: ""
        val email       = intent.getStringExtra("reserva_email") ?: ""
        val fechaInicio = intent.getStringExtra("reserva_fecha_inicio") ?: ""
        val fechaFin    = intent.getStringExtra("reserva_fecha_fin") ?: ""
        val precio      = intent.getDoubleExtra("reserva_precio", 0.0)
        val estado      = intent.getStringExtra("reserva_estado") ?: ""
        val auto = intent.getStringExtra("reserva_auto") ?: "—"

        findViewById<TextView>(R.id.tvDetalleId).text          = "Reserva #$id"
        findViewById<TextView>(R.id.tvDetalleNombres).text     = nombres
        findViewById<TextView>(R.id.tvDetalleEmail).text       = email
        findViewById<TextView>(R.id.tvDetalleFechaInicio).text = fechaInicio.take(10)
        findViewById<TextView>(R.id.tvDetalleFechaFin).text    = fechaFin.take(10)
        findViewById<TextView>(R.id.tvDetallePrecio).text      = "$$precio"
        findViewById<TextView>(R.id.tvDetalleEstado).text      = estado
        findViewById<TextView>(R.id.tvDetalleAuto).text = auto

        findViewById<ImageButton>(R.id.btnVolverDetalleReserva).setOnClickListener {
            finish()
        }

        val progressBar = findViewById<ProgressBar>(R.id.progressBarDetalleReserva)

        findViewById<Button>(R.id.btnCancelarReserva).setOnClickListener {
            AlertDialog.Builder(this)
                .setTitle("Cancelar reserva")
                .setMessage("¿Estás seguro que deseas cancelar esta reserva?")
                .setPositiveButton("Sí, cancelar") { _, _ ->
                    lifecycleScope.launch {
                        try {
                            progressBar.visibility = View.VISIBLE
                            val response = RetrofitInstance.api.cancelarReserva(id)
                            if (response.isSuccessful) {
                                Toast.makeText(
                                    this@DetalleReservaActivity,
                                    "   Reserva cancelada correctamente",
                                    Toast.LENGTH_LONG
                                ).show()
                                finish()
                            } else {
                                Toast.makeText(
                                    this@DetalleReservaActivity,
                                    "Error al cancelar la reserva",
                                    Toast.LENGTH_SHORT
                                ).show()
                            }
                        } catch (e: Exception) {
                            Toast.makeText(
                                this@DetalleReservaActivity,
                                "Error: ${e.message}",
                                Toast.LENGTH_LONG
                            ).show()
                        } finally {
                            progressBar.visibility = View.GONE
                        }
                    }
                }
                .setNegativeButton("No", null)
                .show()
        }
    }
}