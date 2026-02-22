package com.cibertec.rentifydemo

data class ReservaResponse(
    val id: Long,
    val nombres: String?,
    val email: String?,
    val fecha_inicio: String?,
    val fecha_fin: String?,
    val precio_total: Double?,
    val estado: String?
)
