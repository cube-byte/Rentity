package com.rentify.ProjectRentify.dto;

import com.rentify.ProjectRentify.entity.Usuario;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {

    private Long id;
    private String nombres;
    private String apellidos;
    private String email;
    private Usuario.Rol rol;
    private String mensaje;
    private Boolean exito;

    // Login exitoso
    public LoginResponse(Usuario usuario, String mensaje) {
        this.id = usuario.getId();
        this.nombres = usuario.getNombres();
        this.apellidos = usuario.getApellidos();
        this.email = usuario.getEmail();
        this.rol = usuario.getRol();
        this.mensaje = mensaje;
        this.exito = true;
    }

    // Login fallido
    public LoginResponse(String mensaje) {
        this.mensaje = mensaje;
        this.exito = false;
    }
}
