package com.rentify.ProjectRentify.service.impl;

import java.time.Year;
import java.util.List;

import org.springframework.stereotype.Service;

import com.rentify.ProjectRentify.dto.PagoConfirmarDTO;
import com.rentify.ProjectRentify.entity.Comprobante;
import com.rentify.ProjectRentify.entity.Pago;
import com.rentify.ProjectRentify.entity.Reserva;
import com.rentify.ProjectRentify.repository.ComprobanteRepository;
import com.rentify.ProjectRentify.repository.PagoRepository;

import com.rentify.ProjectRentify.service.PagoService;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class PagoImpl implements PagoService{
	
    private final PagoRepository pagoRepo;
    private final ComprobanteRepository comRepo;

    @Override
    public List<Pago> listar() {
        return pagoRepo.findAll();
    }
    
    @Override
    @Transactional
    public Pago completarPago(Long id, PagoConfirmarDTO dto) {
    
        Pago pago = pagoRepo.findById(id).orElseThrow(() -> new RuntimeException("Pago no encontrado"));
    	
        Reserva reserva = pago.getReserva();

    	pago.setMetodo(dto.getMetodo());
    	
        pago.setEstado("COMPLETADO");
        
        reserva.setEstado("CONFIRMADA");
        
        Pago pagoGuardado = pagoRepo.save(pago);

        long correlativo = comRepo.ultimoId() + 1;
        String codigo = "C-" + Year.now().getValue() + "-" + String.format("%04d", correlativo);
        
        Comprobante com = new Comprobante();
        com.setPago(pagoGuardado);
        com.setCodigo(codigo);
        
        comRepo.save(com);

        return pagoRepo.save(pagoGuardado);
    }
    
    @Override
    public Pago buscarPorId(Long id) {
        return pagoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));
    }
    
    @Override
    public Pago buscarPorReservaId(Long idReserva) {
        return pagoRepo.findByReservaId(idReserva);
    }
    
}
