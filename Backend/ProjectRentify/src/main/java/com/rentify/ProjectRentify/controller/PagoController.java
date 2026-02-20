package com.rentify.ProjectRentify.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rentify.ProjectRentify.dto.PagoConfirmarDTO;

import com.rentify.ProjectRentify.entity.Pago;

import com.rentify.ProjectRentify.service.PagoService;

import lombok.AllArgsConstructor;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v12/pagos")
@AllArgsConstructor
public class PagoController {
	
	private final PagoService pagoSvc;

    @GetMapping
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(pagoSvc.listar());
    }
	
    @PutMapping(value = "/{id}")
    public ResponseEntity<?> completarPago(@PathVariable Long id,@RequestBody PagoConfirmarDTO dto) {
        Pago pago = pagoSvc.completarPago(id,dto);
        return ResponseEntity.ok(pago);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(pagoSvc.buscarPorId(id));
    }
    
}
