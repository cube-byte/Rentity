package com.rentify.ProjectRentify.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VehiculoDTO {
	
    private Long idVehiculo;
    private String marca;
    private String model;
    private String categoria;
    private String combustible;
    private Integer year;
    private BigDecimal precio;
    private String estado;
    
}
