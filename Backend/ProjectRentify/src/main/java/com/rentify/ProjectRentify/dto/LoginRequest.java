package com.rentify.ProjectRentify.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
	private String nombre;
    private String contrasena;
	

}
