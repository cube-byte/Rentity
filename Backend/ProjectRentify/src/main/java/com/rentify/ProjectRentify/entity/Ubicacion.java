package com.rentify.ProjectRentify.entity;

import jakarta.persistence.*;
import java.util.List;


@Entity
@Table(name = "locations")
public class Ubicacion {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "location_id")
    private Long id;

    @Column(name = "street_address")
    private String direccion;

    @Column(name = "postal_code")
    private String codigoPostal;

    @Column(name = "city")
    private String ciudad;

    @Column(name = "state_province")
    private String provincia;

    @ManyToOne
    @JoinColumn(name = "country_id")
    private Pais pais;

	public Ubicacion() {
		super();
	}
	
	public Ubicacion(Long id, String direccion, String codigoPostal, String ciudad, String provincia, Pais pais) {
		super();
		this.id = id;
		this.direccion = direccion;
		this.codigoPostal = codigoPostal;
		this.ciudad = ciudad;
		this.provincia = provincia;
		this.pais = pais;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getDireccion() {
		return direccion;
	}

	public void setDireccion(String direccion) {
		this.direccion = direccion;
	}

	public String getCodigoPostal() {
		return codigoPostal;
	}

	public void setCodigoPostal(String codigoPostal) {
		this.codigoPostal = codigoPostal;
	}

	public String getCiudad() {
		return ciudad;
	}

	public void setCiudad(String ciudad) {
		this.ciudad = ciudad;
	}

	public String getProvincia() {
		return provincia;
	}

	public void setProvincia(String provincia) {
		this.provincia = provincia;
	}

	public Pais getPais() {
		return pais;
	}

	public void setPais(Pais pais) {
		this.pais = pais;
	}

	@OneToMany(mappedBy = "ubicacion")
    private List<Auto> auto;
	
    
    

}
