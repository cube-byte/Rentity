package com.cibertec.rentifydemo

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import kotlinx.coroutines.launch

class ReservasFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_reservas, container, false)

        val usuarioId   = arguments?.getLong("usuario_id") ?: 0L
        val recycler    = view.findViewById<RecyclerView>(R.id.recyclerReservas)
        val progressBar = view.findViewById<ProgressBar>(R.id.progressBarReservas)
        val layoutVacio = view.findViewById<LinearLayout>(R.id.layoutVacio)

        recycler.layoutManager = LinearLayoutManager(requireContext())

        lifecycleScope.launch {
            try {
                progressBar.visibility = View.VISIBLE
                val response = RetrofitInstance.api.listarReservasPorUsuario(usuarioId)

                if (response.isSuccessful) {
                    val reservas = response.body() ?: emptyList()
                    if (reservas.isEmpty()) {
                        layoutVacio.visibility = View.VISIBLE
                        recycler.visibility = View.GONE
                    } else {
                        layoutVacio.visibility = View.GONE
                        recycler.visibility = View.VISIBLE
                        recycler.adapter = ReservaAdapter(reservas)
                    }
                } else {
                    Toast.makeText(requireContext(), "Error al cargar reservas", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(requireContext(), "Error: ${e.message}", Toast.LENGTH_LONG).show()
            } finally {
                progressBar.visibility = View.GONE
            }
        }

        return view
    }
}