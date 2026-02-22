package com.cibertec.rentifydemo

data class RegisterRequest(
    val nombres: String,
    val apellidos: String,
    val documento: String,
    val licencia: String,
    val telefono: String,
    val email: String,
    val password: String,
    val rol: String,
    val activo: Boolean = true,
    val fechaRegistro: String? = null  // null porque Spring lo configura
)

