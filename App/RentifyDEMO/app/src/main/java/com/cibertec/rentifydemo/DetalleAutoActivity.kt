package com.cibertec.rentifydemo

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.ImageButton
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class DetalleAutoActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_detalle_auto)

        val marca       = intent.getStringExtra("marca") ?: ""
        val modelo      = intent.getStringExtra("modelo") ?: ""
        val version     = intent.getStringExtra("version") ?: ""
        val year        = intent.getIntExtra("year", 0)
        val color       = intent.getStringExtra("color") ?: ""
        val kilometraje = intent.getLongExtra("kilometraje", 0)
        val combustible = intent.getStringExtra("combustible") ?: ""
        val categoria   = intent.getStringExtra("categoria") ?: ""
        val placa       = intent.getStringExtra("placa") ?: ""
        val descripcion = intent.getStringExtra("descripcion") ?: ""
        val precio      = intent.getDoubleExtra("precio", 0.0)
        val ubicacion   = intent.getStringExtra("ubicacion") ?: "No especificada"
        val idAuto      = intent.getLongExtra("idAuto", 0L)
        val idVehiculo  = intent.getLongExtra("idVehiculo", 0L)
        val usuarioId   = intent.getLongExtra("usuario_id", 0L)
        val usuarioNombre   = intent.getStringExtra("usuario_nombre") ?: ""
        val usuarioApellido = intent.getStringExtra("usuario_apellido") ?: ""
        val usuarioEmail    = intent.getStringExtra("usuario_email") ?: ""

        findViewById<TextView>(R.id.tvMarcaModelo).text  = "$marca $modelo"
        findViewById<TextView>(R.id.tvVersion).text      = version
        findViewById<TextView>(R.id.tvPrecio).text       = "$$precio / día"
        findViewById<TextView>(R.id.tvYear).text         = year.toString()
        findViewById<TextView>(R.id.tvColor).text        = color
        findViewById<TextView>(R.id.tvKilometraje).text  = "$kilometraje km"
        findViewById<TextView>(R.id.tvCombustible).text  = combustible
        findViewById<TextView>(R.id.tvCategoria).text    = categoria
        findViewById<TextView>(R.id.tvPlaca).text        = placa
        findViewById<TextView>(R.id.tvDescripcion).text  = descripcion
        findViewById<TextView>(R.id.tvUbicacion).text    = ubicacion

        findViewById<ImageButton>(R.id.btnVolver).setOnClickListener {
            finish()
        }

        findViewById<Button>(R.id.btnReservar).setOnClickListener {
            val reservaIntent = Intent(this, ReservaActivity::class.java)
            reservaIntent.putExtra("idAuto",           idAuto)
            reservaIntent.putExtra("idVehiculo",       idVehiculo)
            reservaIntent.putExtra("marca",            marca)
            reservaIntent.putExtra("modelo",           modelo)
            reservaIntent.putExtra("precio",           precio)
            reservaIntent.putExtra("usuario_id",       usuarioId)
            reservaIntent.putExtra("usuario_nombre",   usuarioNombre)
            reservaIntent.putExtra("usuario_apellido", usuarioApellido)
            reservaIntent.putExtra("usuario_email",    usuarioEmail)
            startActivity(reservaIntent)
        }
    }
}