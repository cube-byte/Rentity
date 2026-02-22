package com.cibertec.rentifydemo

data class UsuarioPerfil(
    val id: Long,
    val nombres: String?,
    val apellidos: String?,
    val documento: String?,
    val licencia: String?,
    val telefono: String?,
    val email: String?,
    val rol: String?,
    val ubicacion: Ubicacion?
)
