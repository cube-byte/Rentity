package com.cibertec.rentifydemo

data class Ubicacion(
    val id: Long,
    val nombre: String
)

data class Vehiculo(
    val vehiculo: Long,
    val marca: String,
    val model: String,
    val version: String,
    val year: Int,
    val categoria: String,
    val carroceria: String,
    val combustible: String,
    val descripcion: String,
    val precio: Double,
    val estado: String,
    val imagen: String?
)

data class Auto(
    val auto: Long,
    val placa: String,
    val vehiculo: Vehiculo,  // Aquí referencia al data class de arriba
    val color: String,
    val kilometraje: Long,
    val estado: String,
    val ubicacion: Ubicacion?
)
