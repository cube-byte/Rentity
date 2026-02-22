package com.cibertec.rentifydemo

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.ProgressBar
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import kotlinx.coroutines.launch

class BuscarFragment : Fragment() {

    private lateinit var recyclerAutos: RecyclerView
    private lateinit var progressBar: ProgressBar
    private lateinit var etMarca: EditText
    private lateinit var etModelo: EditText
    private lateinit var btnBuscar: Button

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_buscar, container, false)

        recyclerAutos = view.findViewById(R.id.recyclerBuscar)
        progressBar   = view.findViewById(R.id.progressBarBuscar)
        etMarca       = view.findViewById(R.id.etMarca)
        etModelo      = view.findViewById(R.id.etModelo)
        btnBuscar     = view.findViewById(R.id.btnBuscar)

        btnBuscar.setOnClickListener {
            val marca  = etMarca.text.toString().trim().ifEmpty { null }
            val modelo = etModelo.text.toString().trim().ifEmpty { null }
            buscarAutos(marca, modelo)
        }

        return view
    }

    private fun buscarAutos(marca: String?, modelo: String?) {
        progressBar.visibility = View.VISIBLE
        recyclerAutos.visibility = View.GONE

        lifecycleScope.launch {
            try {
                val response = RetrofitInstance.api.listarAutos(marca, modelo)

                if (response.isSuccessful) {
                    val autos = response.body() ?: emptyList()
                    if (autos.isEmpty()) {
                        Toast.makeText(requireContext(), "No se encontraron vehículos", Toast.LENGTH_SHORT).show()
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
                            intent.putExtra("ubicacion",   auto.ubicacion?.nombre ?: "No especificada")
                            startActivity(intent)
                        }
                        recyclerAutos.layoutManager = LinearLayoutManager(requireContext())
                        recyclerAutos.adapter = adapter
                    }
                } else {
                    Toast.makeText(requireContext(), "Error al buscar", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(requireContext(), "Error de conexión: ${e.message}", Toast.LENGTH_LONG).show()
            } finally {
                progressBar.visibility = View.GONE
                recyclerAutos.visibility = View.VISIBLE
            }
        }
    }
}