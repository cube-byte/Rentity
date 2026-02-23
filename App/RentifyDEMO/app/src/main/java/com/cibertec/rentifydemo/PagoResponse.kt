package com.cibertec.rentifydemo

data class PagoResponse(
    val id: Long,
    val monto: Double?,
    val metodo: String?,
    val estado: String?
)
