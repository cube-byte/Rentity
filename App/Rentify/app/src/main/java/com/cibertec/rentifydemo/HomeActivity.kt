package com.cibertec.rentifydemo

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.google.android.material.bottomnavigation.BottomNavigationView

class HomeActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        if (savedInstanceState == null) {
            loadFragment(crearAutosFragment())
        }

        val bottomNav = findViewById<BottomNavigationView>(R.id.bottom_navigation)
        bottomNav.setOnItemSelectedListener { item ->
            val fragment = when (item.itemId) {
                R.id.nav_autos    -> crearAutosFragment()
                R.id.nav_buscar   -> BuscarFragment()
                R.id.nav_reservas -> crearReservasFragment()
                R.id.nav_perfil   -> crearPerfilFragment()
                else -> crearAutosFragment()
            }
            loadFragment(fragment)
            true
        }
    }

    private fun crearAutosFragment(): AutosFragment {
        val fragment = AutosFragment()
        val bundle = Bundle()
        bundle.putString("usuario_nombre",   intent.getStringExtra("usuario_nombre") ?: "")
        bundle.putString("usuario_apellido", intent.getStringExtra("usuario_apellido") ?: "")
        bundle.putString("usuario_email",    intent.getStringExtra("usuario_email") ?: "")
        bundle.putLong("usuario_id",         intent.getLongExtra("usuario_id", 0L))
        fragment.arguments = bundle
        return fragment
    }

    private fun crearPerfilFragment(): PerfilFragment {
        val fragment = PerfilFragment()
        val bundle = Bundle()
        bundle.putString("usuario_nombre",   intent.getStringExtra("usuario_nombre") ?: "")
        bundle.putString("usuario_apellido", intent.getStringExtra("usuario_apellido") ?: "")
        bundle.putString("usuario_email",    intent.getStringExtra("usuario_email") ?: "")
        bundle.putString("usuario_rol",      intent.getStringExtra("usuario_rol") ?: "")
        bundle.putLong("usuario_id",         intent.getLongExtra("usuario_id", 0L))
        fragment.arguments = bundle
        return fragment
    }

    private fun crearReservasFragment(): ReservasFragment {
        val fragment = ReservasFragment()
        val bundle = Bundle()
        bundle.putLong("usuario_id", intent.getLongExtra("usuario_id", 0L))
        fragment.arguments = bundle
        return fragment
    }

    private fun loadFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragment_container, fragment)
            .commit()
    }
}