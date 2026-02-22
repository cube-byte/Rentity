package com.cibertec.rentifydemo

data class ReservaRequest(
    val idUsuario: Long,
    val nombres: String,
    val email: String,
    val telefono: String,
    val DNI: String,
    val idVehiculo: Long,
    val idAuto: Long,
    val fecha_inicio: String,
    val fecha_fin: String
)
