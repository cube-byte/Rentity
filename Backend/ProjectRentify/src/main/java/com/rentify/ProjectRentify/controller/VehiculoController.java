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
import org.springframework.web.multipart.MultipartFile;

import com.rentify.ProjectRentify.dto.VehiculoCreateDTO;
import com.rentify.ProjectRentify.dto.VehiculoUpdateDTO;

import com.rentify.ProjectRentify.entity.Vehiculo;

import com.rentify.ProjectRentify.service.VehiculoService;

import lombok.AllArgsConstructor;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/v12/vehiculos")
@AllArgsConstructor
public class VehiculoController {

	private final VehiculoService service;

    @GetMapping
    public ResponseEntity<?> listarVehiculos() {
        return ResponseEntity.ok(service.listar());
    }

    @PostMapping  //(consumes = MediaType.MULTIPART_FORM_DATA_VALUE) se quito para test
    public ResponseEntity<?> crear(
    		@RequestBody VehiculoCreateDTO dto //solo poner para test
    		
            //@RequestPart("vehiculo") VehiculoCreateDTO dto, @RequestPart(value = "imagen", required = false) MultipartFile imagen
    ) throws IOException {

    	Vehiculo guardado = service.guardar(dto, null);//Se puse null para test
        return ResponseEntity.status(HttpStatus.CREATED).body(guardado);
    }

    
    
    @GetMapping("/{id}")
    public ResponseEntity<?> read(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    
    
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> actualizar(
            @PathVariable Long id,
            @RequestPart("auto") VehiculoUpdateDTO dto,
            @RequestPart(value = "imagen", required = false) MultipartFile imagen
    ) throws IOException {

        service.actualizar(id, dto, imagen);
        return ResponseEntity.noContent().build();
    }
    
    /**@PutMapping("/{id}")  // Cambiar esta línea
    public ResponseEntity<?> actualizar(
            @PathVariable Long id,
            @RequestBody VehiculoUpdateDTO dto  // Cambiar a @RequestBody
    ) throws IOException {
        service.actualizar(id, dto, null);  // Pasar null para imagen
        return ResponseEntity.noContent().build();
    }**/

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
    	service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
	
}
