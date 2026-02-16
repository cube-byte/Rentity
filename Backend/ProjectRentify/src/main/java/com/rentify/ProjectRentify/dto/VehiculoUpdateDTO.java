package com.rentify.ProjectRentify.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class VehiculoUpdateDTO {

	private String marca;
	private String model;
	private String version;
	private int year;
	private String categoria;
	private String carroceria;
	private String combustible;
	private String descripcion;
	private BigDecimal precio;
	private String estado;
	
}
