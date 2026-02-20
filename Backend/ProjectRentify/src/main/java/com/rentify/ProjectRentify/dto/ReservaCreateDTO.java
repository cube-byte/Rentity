package com.rentify.ProjectRentify.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ReservaCreateDTO {
	
	private Long idUsuario;
	
	//private String nombres;
    //private String email;
	//private String telefono;
	//private String DNI;

    private Long idVehiculo;
    private Long idAuto;
    
    private LocalDateTime fecha_inicio;
    private LocalDateTime fecha_fin;
	
}
