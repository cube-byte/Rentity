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
	    private String nombre;
	    private Usuario.Rol rol;
	    private String mensaje;
	    private Boolean exito;
	    
	    // Constructor para login exitoso
	    public LoginResponse(Usuario usuario, String mensaje) {
	        this.id = usuario.getId();
	        this.nombre = usuario.getNombre();
	        this.rol = usuario.getRol();
	        this.mensaje = mensaje;
	        this.exito = true;
	    }
	    
	    // Constructor para login fallido
	    public LoginResponse(String mensaje) {
	        this.mensaje = mensaje;
	        this.exito = false;
	    }

}
