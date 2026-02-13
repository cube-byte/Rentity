package com.rentify.ProjectRentify.entity;

import jakarta.persistence.*;
import java.util.List;


@Entity
@Table(name = "countries")
public class Pais {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "country_id")
    private Long id;

    @Column(name = "country_name")
    private String nombre;

    @ManyToOne
    @JoinColumn(name = "region_id")
    private Region region;

	public Pais() {
		super();
	}
	
	public Pais(Long id, String nombre, Region region) {
		super();
		this.id = id;
		this.nombre = nombre;
		this.region = region;
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

	public Region getRegion() {
		return region;
	}

	public void setRegion(Region region) {
		this.region = region;
	}

    
	@OneToMany(mappedBy = "pais")
	private List<Ubicacion> ubicaciones; 

    
    
}
