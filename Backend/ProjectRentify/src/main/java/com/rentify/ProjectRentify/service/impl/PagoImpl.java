package com.rentify.ProjectRentify.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.rentify.ProjectRentify.dto.PagoConfirmarDTO;

import com.rentify.ProjectRentify.entity.Pago;
import com.rentify.ProjectRentify.entity.Reserva;

import com.rentify.ProjectRentify.repository.PagoRepository;
import com.rentify.ProjectRentify.repository.ReservaRepository;

import com.rentify.ProjectRentify.service.PagoService;


import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class PagoImpl implements PagoService{
	
    private final PagoRepository pagoRepo;
    private final ReservaRepository reservaRepo;

    @Override
    public List<Pago> listar() {
        return pagoRepo.findAll();
    }
    
    @Override
    public Pago completarPago(Long id, PagoConfirmarDTO dto) {
    
        Pago pago = pagoRepo.findById(id).orElseThrow(() -> new RuntimeException("Pago no encontrado"));
    	
        Reserva reserva = pago.getReserva();

    	pago.setMetodo(dto.getMetodo());
    	
        pago.setEstado("COMPLETADO");
        
        reserva.setEstado("CONFIRMADA");

        return pagoRepo.save(pago);
    }
    
    @Override
    public Pago buscarPorId(Long id) {
        return pagoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));
    }
    
}
