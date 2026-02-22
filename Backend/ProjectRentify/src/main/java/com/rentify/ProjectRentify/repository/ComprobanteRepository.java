package com.rentify.ProjectRentify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.rentify.ProjectRentify.entity.Comprobante;

public interface ComprobanteRepository extends JpaRepository<Comprobante, Long>{
	
	@Query("SELECT COALESCE(MAX(c.id),0) FROM Comprobante c")
	long ultimoId();
}
