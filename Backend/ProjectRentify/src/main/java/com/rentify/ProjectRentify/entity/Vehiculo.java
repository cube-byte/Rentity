package com.rentify.ProjectRentify.entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="tb_vehiculo")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehiculo {
	
	@Id
	@Column(name="id_vehiculo", unique = true, nullable = false)
	private long vehiculo;
	

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
	private String imagen;
}
