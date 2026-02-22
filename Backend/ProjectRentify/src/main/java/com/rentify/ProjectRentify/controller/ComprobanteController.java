package com.rentify.ProjectRentify.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rentify.ProjectRentify.service.ComprobanteService;

import lombok.AllArgsConstructor;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v12/comprobante")
@AllArgsConstructor
public class ComprobanteController {
	
	private final ComprobanteService comSvc;

    @GetMapping
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(comSvc.listar());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(comSvc.buscarPorId(id));
    }
}
