package com.cibertec.rentifydemo

import android.app.DatePickerDialog
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.ImageButton
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.launch
import java.util.Calendar

class ReservaActivity : AppCompatActivity() {

    private var fechaInicio: Calendar? = null
    private var fechaFin: Calendar? = null
    private var precioPorDia: Double = 0.0

    private lateinit var btnFechaInicio: Button
    private lateinit var btnFechaFin: Button
    private lateinit var tvResumenPrecio: TextView
    private lateinit var progressBar: ProgressBar

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_reserva)

        val idAuto          = intent.getLongExtra("idAuto", 0L)
        val idVehiculo      = intent.getLongExtra("idVehiculo", 0L)
        val marca           = intent.getStringExtra("marca") ?: ""
        val modelo          = intent.getStringExtra("modelo") ?: ""
        precioPorDia        = intent.getDoubleExtra("precio", 0.0)
        val idUsuario       = intent.getLongExtra("usuario_id", 0L)
        val nombres         = intent.getStringExtra("usuario_nombre") ?: ""
        val apellidos       = intent.getStringExtra("usuario_apellido") ?: ""
        val email           = intent.getStringExtra("usuario_email") ?: ""
        val telefono        = intent.getStringExtra("usuario_telefono") ?: ""
        val dni             = intent.getStringExtra("usuario_documento") ?: ""

        btnFechaInicio  = findViewById(R.id.btnFechaInicio)
        btnFechaFin     = findViewById(R.id.btnFechaFin)
        tvResumenPrecio = findViewById(R.id.tvResumenPrecio)
        progressBar     = findViewById(R.id.progressBarReserva)

        findViewById<TextView>(R.id.tvAutoReserva).text = "$marca $modelo — $$precioPorDia/día"
        findViewById<ImageButton>(R.id.btnVolverReserva).setOnClickListener { finish() }

        btnFechaInicio.setOnClickListener {
            mostrarDatePicker { cal ->
                fechaInicio = cal
                btnFechaInicio.text = "${cal.get(Calendar.DAY_OF_MONTH)}/${cal.get(Calendar.MONTH)+1}/${cal.get(Calendar.YEAR)}"
                actualizarResumen()
            }
        }

        btnFechaFin.setOnClickListener {
            mostrarDatePicker { cal ->
                fechaFin = cal
                btnFechaFin.text = "${cal.get(Calendar.DAY_OF_MONTH)}/${cal.get(Calendar.MONTH)+1}/${cal.get(Calendar.YEAR)}"
                actualizarResumen()
            }
        }

        findViewById<Button>(R.id.btnConfirmarReserva).setOnClickListener {
            if (fechaInicio == null || fechaFin == null) {
                Toast.makeText(this, "Selecciona las fechas", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }
            if (!fechaFin!!.after(fechaInicio!!)) {
                Toast.makeText(this, "La fecha de fin debe ser posterior a la de inicio", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val inicio = formatearFecha(fechaInicio!!)
            val fin    = formatearFecha(fechaFin!!)

            val request = ReservaRequest(
                idUsuario    = idUsuario,
                nombres      = "$nombres $apellidos",
                email        = email,
                telefono     = telefono,
                DNI          = dni,
                idVehiculo   = idVehiculo,
                idAuto       = idAuto,
                fecha_inicio = inicio,
                fecha_fin    = fin
            )

            lifecycleScope.launch {
                try {
                    progressBar.visibility = View.VISIBLE
                    val response = RetrofitInstance.api.crearReserva(request)
                    if (response.isSuccessful) {
                        Toast.makeText(this@ReservaActivity, "¡Reserva confirmada!", Toast.LENGTH_LONG).show()
                        finish()
                    } else {
                        Toast.makeText(this@ReservaActivity, "Error al reservar: ${response.code()}", Toast.LENGTH_SHORT).show()
                    }
                } catch (e: Exception) {
                    Toast.makeText(this@ReservaActivity, "Error: ${e.message}", Toast.LENGTH_LONG).show()
                } finally {
                    progressBar.visibility = View.GONE
                }
            }
        }
    }

    private fun mostrarDatePicker(onFechaSeleccionada: (Calendar) -> Unit) {
        val cal = Calendar.getInstance()
        DatePickerDialog(this,
            { _, year, month, day ->
                val selected = Calendar.getInstance()
                selected.set(year, month, day, 10, 0, 0)
                onFechaSeleccionada(selected)
            },
            cal.get(Calendar.YEAR),
            cal.get(Calendar.MONTH),
            cal.get(Calendar.DAY_OF_MONTH)
        ).show()
    }

    private fun formatearFecha(cal: Calendar): String {
        val year  = cal.get(Calendar.YEAR)
        val month = String.format("%02d", cal.get(Calendar.MONTH) + 1)
        val day   = String.format("%02d", cal.get(Calendar.DAY_OF_MONTH))
        return "${year}-${month}-${day}T10:00:00"
    }

    private fun actualizarResumen() {
        val ini = fechaInicio
        val fin = fechaFin
        if (ini != null && fin != null && fin.after(ini)) {
            val diff = fin.timeInMillis - ini.timeInMillis
            val dias = (diff / (1000 * 60 * 60 * 24))
            val total = dias * precioPorDia
            tvResumenPrecio.text = "$dias día(s) × $$precioPorDia = $$total total"
        }
    }
}