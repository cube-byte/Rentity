package com.rentify.ProjectRentify.controller;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.rentify.ProjectRentify.dto.ReservaCreateDTO;

import com.rentify.ProjectRentify.entity.Reserva;

import com.rentify.ProjectRentify.service.ReservaService;

import lombok.AllArgsConstructor;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v12/reservas")
@AllArgsConstructor
public class ReservaController {

    private final ReservaService reservaSvc;
    
    @GetMapping
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(reservaSvc.listar());
    }
    
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody ReservaCreateDTO dto) throws IOException {
        Reserva guardado = reservaSvc.guardar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(reservaSvc.buscarPorId(id));
    }
    
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<?> listarPorUsuario(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(reservaSvc.listarPorUsuario(idUsuario));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelar(@PathVariable Long id) {
        try {
            reservaSvc.cancelar(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
