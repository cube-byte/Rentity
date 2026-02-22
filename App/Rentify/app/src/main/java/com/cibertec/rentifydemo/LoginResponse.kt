package com.cibertec.rentifydemo

data class LoginResponse(
    val id: Long?,
    val nombres: String?,
    val apellidos: String?,
    val email: String?,
    val rol: String?,
    val mensaje: String?,
    val exito: Boolean
)

