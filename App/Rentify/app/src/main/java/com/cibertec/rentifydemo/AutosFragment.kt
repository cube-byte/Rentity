package com.cibertec.rentifydemo

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import kotlinx.coroutines.launch

class AutosFragment : Fragment() {

    private lateinit var recyclerAutos: RecyclerView
    private lateinit var progressBar: ProgressBar
    private lateinit var tvNombreUsuario: TextView

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_autos, container, false)

        recyclerAutos = view.findViewById(R.id.recyclerAutos)
        progressBar = view.findViewById(R.id.progressBar)
        tvNombreUsuario = view.findViewById(R.id.tvNombreUsuario)

        // Recibir nombre del usuario
        val nombreUsuario = arguments?.getString("usuario_nombre")
        if (!nombreUsuario.isNullOrEmpty()) {
            tvNombreUsuario.text = "Hola, $nombreUsuario"
        }

        recyclerAutos.layoutManager = LinearLayoutManager(requireContext())
        cargarAutos()

        return view
    }

    private fun cargarAutos() {
        progressBar.visibility = View.VISIBLE
        recyclerAutos.visibility = View.GONE

        lifecycleScope.launch {
            try {
                val response = RetrofitInstance.api.listarAutos()

                if (response.isSuccessful) {
                    val autos = response.body() ?: emptyList()

                    if (autos.isEmpty()) {
                        Toast.makeText(requireContext(), "No hay vehículos disponibles", Toast.LENGTH_SHORT).show()
                    } else {
                        val adapter = AutoAdapter(autos) { auto ->
                            val intent = android.content.Intent(requireContext(), DetalleAutoActivity::class.java)
                            intent.putExtra("marca",       auto.vehiculo.marca)
                            intent.putExtra("modelo",      auto.vehiculo.model)
                            intent.putExtra("version",     auto.vehiculo.version)
                            intent.putExtra("year",        auto.vehiculo.year)
                            intent.putExtra("color",       auto.color)
                            intent.putExtra("kilometraje", auto.kilometraje)
                            intent.putExtra("combustible", auto.vehiculo.combustible)
                            intent.putExtra("categoria",   auto.vehiculo.categoria)
                            intent.putExtra("placa",       auto.placa)
                            intent.putExtra("descripcion", auto.vehiculo.descripcion)
                            intent.putExtra("precio",      auto.vehiculo.precio)
                            intent.putExtra("ubicacion", auto.ubicacion?.nombre ?: "No especificada")
                            intent.putExtra("idAuto",     auto.auto)
                            intent.putExtra("idVehiculo", auto.vehiculo.vehiculo)
                            intent.putExtra("usuario_id",        arguments?.getLong("usuario_id") ?: 0L)
                            intent.putExtra("usuario_nombre",    arguments?.getString("usuario_nombre") ?: "")
                            intent.putExtra("usuario_apellido",  arguments?.getString("usuario_apellido") ?: "")
                            intent.putExtra("usuario_email",     arguments?.getString("usuario_email") ?: "")
                            startActivity(intent)
                        }
                        recyclerAutos.adapter = adapter
                    }
                } else {
                    Toast.makeText(requireContext(), "Error al cargar vehículos", Toast.LENGTH_SHORT).show()
                }

            } catch (e: Exception) {
                e.printStackTrace()
                Toast.makeText(requireContext(), "Error de conexión: ${e.message}", Toast.LENGTH_LONG).show()
            } finally {
                progressBar.visibility = View.GONE
                recyclerAutos.visibility = View.VISIBLE
            }
        }
    }
}