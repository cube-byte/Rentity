package com.rentify.ProjectRentify.service;

import java.util.List;

import com.rentify.ProjectRentify.entity.Comprobante;

public interface ComprobanteService {
	
	List<Comprobante> listar(); 
	
	Comprobante buscarPorId(Long id);

}
