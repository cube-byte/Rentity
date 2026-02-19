package com.rentify.ProjectRentify.service.impl;

import java.io.IOException;

import java.util.List;

import org.springframework.stereotype.Service;


import com.rentify.ProjectRentify.dto.UbicacionDTO;

import com.rentify.ProjectRentify.entity.Ubicacion;

import com.rentify.ProjectRentify.repository.UbicacionRepository;

import com.rentify.ProjectRentify.service.UbicacionService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UbicacionImpl implements UbicacionService {

    private final UbicacionRepository repoUbicacion;
	
    @Override
    public List<Ubicacion> listar() {
        return repoUbicacion.findAll();
    }
    
    @Override
    public Ubicacion guardar(UbicacionDTO dto) throws IOException {

    	Ubicacion ubi = new Ubicacion();

    	ubi.setNombre(dto.getNombre());

        return repoUbicacion.save(ubi);
    }
}
