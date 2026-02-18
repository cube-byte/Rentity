package com.rentify.ProjectRentify.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.rentify.ProjectRentify.dto.VehiculoCreateDTO;
import com.rentify.ProjectRentify.dto.VehiculoUpdateDTO;
import com.rentify.ProjectRentify.entity.Vehiculo;

public interface VehiculoService {

    List<Vehiculo> listar();

    Vehiculo guardar(VehiculoCreateDTO dto, MultipartFile imagen) throws IOException;

    Vehiculo buscarPorId(Long id);

    Vehiculo actualizar(Long id, VehiculoUpdateDTO dto, MultipartFile imagen) throws IOException;

    void eliminar(Long id);
    
}
