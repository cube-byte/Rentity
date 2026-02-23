package com.cibertec.rentifydemo

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.ProgressBar
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.launch

class PerfilFragment : Fragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_perfil, container, false)

        val usuarioId = arguments?.getLong("usuario_id") ?: 0L

        val tvNombre    = view.findViewById<TextView>(R.id.tvNombrePerfil)
        val tvEmail     = view.findViewById<TextView>(R.id.tvEmailPerfil)
        val tvRol       = view.findViewById<TextView>(R.id.tvRolPerfil)
        val tvDocumento = view.findViewById<TextView>(R.id.tvDocumento)
        val tvLicencia  = view.findViewById<TextView>(R.id.tvLicencia)
        val tvTelefono  = view.findViewById<TextView>(R.id.tvTelefono)
        val tvUbicacion = view.findViewById<TextView>(R.id.tvUbicacionPerfil)
        val progressBar = view.findViewById<ProgressBar>(R.id.progressBarPerfil)

        lifecycleScope.launch {
            try {
                progressBar.visibility = View.VISIBLE
                val response = RetrofitInstance.api.obtenerPerfil(usuarioId)

                if (response.isSuccessful) {
                    val perfil = response.body()!!
                    tvNombre.text    = "${perfil.nombres} ${perfil.apellidos}"
                    tvEmail.text     = perfil.email ?: ""
                    tvRol.text       = perfil.rol ?: ""
                    tvDocumento.text = perfil.documento ?: ""
                    tvLicencia.text  = perfil.licencia ?: ""
                    tvTelefono.text  = perfil.telefono ?: ""
                    tvUbicacion.text = perfil.ubicacion?.nombre ?: "No especificada"
                } else {
                    Toast.makeText(requireContext(), "Error al cargar perfil", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                Toast.makeText(requireContext(), "Error de conexión: ${e.message}", Toast.LENGTH_SHORT).show()
            } finally {
                progressBar.visibility = View.GONE
            }
        }

        view.findViewById<Button>(R.id.btnCerrarSesion).setOnClickListener {
            val intent = Intent(requireContext(), MainActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
        }

        return view
    }
}