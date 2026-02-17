package com.rentify.ProjectRentify.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.rentify.ProjectRentify.dto.UbicacionDTO;
import com.rentify.ProjectRentify.entity.Ubicacion;
import com.rentify.ProjectRentify.repository.UbicacionRepository;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/v12/ubicaciones")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class UbicacionController {

    private final UbicacionRepository repoUbicacion;

    @GetMapping
    public ResponseEntity<List<Ubicacion>> listarUbicaciones() {
        return ResponseEntity.ok(repoUbicacion.findAll());
    }

    @PostMapping
    public ResponseEntity<Ubicacion> crearUbicacion(@RequestBody UbicacionDTO dto){
        Ubicacion u = new Ubicacion();
        u.setNombre(dto.getNombre());
        return ResponseEntity.status(HttpStatus.CREATED).body(repoUbicacion.save(u));
    }
}
