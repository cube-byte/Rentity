
package com.rentify.ProjectRentify.controller;

import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;

import com.rentify.ProjectRentify.dto.AutoCreateDTO;
import com.rentify.ProjectRentify.dto.AutoUpdateDTO;
import com.rentify.ProjectRentify.entity.Auto;
import com.rentify.ProjectRentify.service.AutoService;

import lombok.AllArgsConstructor;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v12/autos")
@AllArgsConstructor
public class AutoController {

	private final AutoService autoService;

    @GetMapping
    public ResponseEntity<?> listarAutos() {
        return ResponseEntity.ok(autoService.listar());
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody AutoCreateDTO dto) throws IOException {
        Auto guardado = autoService.guardar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> readAuto(@PathVariable Long id) {
        return ResponseEntity.ok(autoService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(
            @PathVariable Long id,
            @RequestBody AutoUpdateDTO dto
    ) throws IOException {

        autoService.actualizar(id, dto);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarAuto(@PathVariable Long id) {
        autoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
    
}
