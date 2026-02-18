package com.rentify.ProjectRentify.controller;

import java.io.IOException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.rentify.ProjectRentify.dto.UbicacionDTO;
import com.rentify.ProjectRentify.entity.Ubicacion;
import com.rentify.ProjectRentify.service.UbicacionService;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/v12/ubicaciones")
@AllArgsConstructor
@CrossOrigin(origins = "*")
public class UbicacionController {

    private final UbicacionService ubicacionService;

    @GetMapping
    public ResponseEntity<?> listar() {
        return ResponseEntity.ok(ubicacionService.listar());
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody UbicacionDTO dto) throws IOException {
        Ubicacion guardado = ubicacionService.guardar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editar(@PathVariable Long id, @RequestBody UbicacionDTO dto) throws IOException {
        Ubicacion actualizado = ubicacionService.actualizar(id, dto);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        ubicacionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}