package com.rentify.ProjectRentify.entity;

import jakarta.persistence.*;
import java.util.List;


@Entity
@Table(name = "regions")
public class Region {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "region_id")
    private Long id;

    @Column(name = "region_name")
    private String nombre;

	public Region() {
		super();
	}

	public Region(Long id, String nombre) {
		super();
		this.id = id;
		this.nombre = nombre;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}
    
	@OneToMany(mappedBy = "region")
    private List<Pais> paises;

}
