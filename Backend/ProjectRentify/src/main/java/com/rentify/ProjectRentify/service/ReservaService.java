package com.rentify.ProjectRentify.service;

import java.util.List;

import com.rentify.ProjectRentify.dto.ReservaCreateDTO;
import com.rentify.ProjectRentify.entity.Reserva;

public interface ReservaService {
	
	List<Reserva> listar();
	
    Reserva guardar(ReservaCreateDTO dto);

    Reserva buscarPorId(Long id);
    
    List<Reserva> listarPorUsuario(Long idUsuario);
    
    void cancelar(Long id);
}
