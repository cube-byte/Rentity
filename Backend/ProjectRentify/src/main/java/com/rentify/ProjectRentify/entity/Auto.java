package com.rentify.ProjectRentify.entity;



import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="tb_vehiculo")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Auto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="id_auto")
	private long auto;

	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private String placa;
	
    @ManyToOne
    @JoinColumn(name = "id_vehiculo", nullable = false)
    private Vehiculo vehiculo;
	
	private String color;
	private long kilometraje;
	private String estado;
	
}
