package com.cibertec.rentifydemo

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class PagoExitosoActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_pago_exitoso)

        val autoNombre   = intent.getStringExtra("auto_nombre") ?: "—"
        val fechaInicio  = intent.getStringExtra("fecha_inicio") ?: "—"
        val fechaFin     = intent.getStringExtra("fecha_fin") ?: "—"
        val monto        = intent.getDoubleExtra("monto", 0.0)
        val reservaId    = intent.getLongExtra("reserva_id", 0L)

        findViewById<TextView>(R.id.tvExitoAuto).text        = autoNombre
        findViewById<TextView>(R.id.tvExitoReservaId).text   = "#$reservaId"
        findViewById<TextView>(R.id.tvExitoFechaInicio).text = fechaInicio
        findViewById<TextView>(R.id.tvExitoFechaFin).text    = fechaFin
        findViewById<TextView>(R.id.tvExitoMonto).text       = "$$monto"

        findViewById<Button>(R.id.btnIrInicio).setOnClickListener {
            val intent = Intent(this, HomeActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
            startActivity(intent)
            finish()
        }
    }
}