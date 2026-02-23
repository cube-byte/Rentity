package com.cibertec.rentifydemo

data class UsuarioReserva(
    val id: Long,
    val nombres: String?,
    val apellidos: String?,
    val email: String?
)

data class ReservaResponse(
    val id: Long,
    val usuario: UsuarioReserva?,
    val nombres: String?,
    val email: String?,
    val fecha_inicio: String?,
    val fecha_fin: String?,
    val precio_total: Double?,
    val estado: String?,
    val auto: AutoReserva?
)

data class AutoReserva(
    val placa: String?,
    val vehiculo: VehiculoReserva?
)

data class VehiculoReserva(
    val marca: String?,
    val model: String?
)
