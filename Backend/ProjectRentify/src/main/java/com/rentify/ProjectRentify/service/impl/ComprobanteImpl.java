package com.rentify.ProjectRentify.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.rentify.ProjectRentify.entity.Comprobante;
import com.rentify.ProjectRentify.repository.ComprobanteRepository;
import com.rentify.ProjectRentify.service.ComprobanteService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ComprobanteImpl implements ComprobanteService{

    private final ComprobanteRepository comRepo;
	
    @Override
    public List<Comprobante> listar() {
        return comRepo.findAll();
    }
    
    @Override
    public Comprobante buscarPorId(Long id) {
        return comRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Comprobante no encontrado"));
    }
}
