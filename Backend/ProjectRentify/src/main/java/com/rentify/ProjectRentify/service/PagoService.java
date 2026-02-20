package com.rentify.ProjectRentify.service;

import java.util.List;

import com.rentify.ProjectRentify.dto.PagoConfirmarDTO;
import com.rentify.ProjectRentify.entity.Pago;


public interface PagoService {
	
	List<Pago> listar(); 
	
	Pago completarPago(Long id, PagoConfirmarDTO dto);

	Pago buscarPorId(Long id);

}
