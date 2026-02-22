package com.cibertec.rentifydemo

import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path
import retrofit2.http.Query

interface AuthApi {

    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>

    @POST("api/auth/registro")
    suspend fun registro(@Body usuario: RegisterRequest): Response<LoginResponse>

    @GET("api/v12/autos")
    suspend fun listarAutos(
        @Query("marca") marca: String? = null,
        @Query("modelo") modelo: String? = null
    ): Response<List<Auto>>

    @GET("api/auth/perfil/{id}")
    suspend fun obtenerPerfil(@Path("id") id: Long): Response<UsuarioPerfil>

    @POST("api/v12/reservas")
    suspend fun crearReserva(@Body request: ReservaRequest): Response<ReservaResponse>

    @GET("api/v12/reservas")
    suspend fun listarReservas(): Response<List<ReservaResponse>>

    @GET("api/v12/reservas/usuario/{idUsuario}")
    suspend fun listarReservasPorUsuario(@Path("idUsuario") idUsuario: Long): Response<List<ReservaResponse>>
}