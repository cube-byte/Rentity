package com.cibertec.rentifydemo

import android.os.Bundle
import android.widget.ImageButton
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

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

        findViewById<TextView>(R.id.tvDetalleId).text          = "Reserva #$id"
        findViewById<TextView>(R.id.tvDetalleNombres).text     = nombres
        findViewById<TextView>(R.id.tvDetalleEmail).text       = email
        findViewById<TextView>(R.id.tvDetalleFechaInicio).text = fechaInicio.take(10)
        findViewById<TextView>(R.id.tvDetalleFechaFin).text    = fechaFin.take(10)
        findViewById<TextView>(R.id.tvDetallePrecio).text      = "$$precio"
        findViewById<TextView>(R.id.tvDetalleEstado).text      = estado

        findViewById<ImageButton>(R.id.btnVolverDetalleReserva).setOnClickListener {
            finish()
        }
    }
}