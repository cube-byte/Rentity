package com.rentify.ProjectRentify.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rentify.ProjectRentify.entity.Reserva;

public interface ReservaRepository extends JpaRepository<Reserva, Long>{
	
	List<Reserva> findByUsuarioId(Long idUsuario);
	
}
