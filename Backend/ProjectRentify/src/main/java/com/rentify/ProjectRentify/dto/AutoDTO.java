package com.rentify.ProjectRentify.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AutoDTO {
	
    private Long idAuto;
    private String placa;
    private Long vehiculo;
    private String color;
    private long kilometraje;
    private String estado;

}
