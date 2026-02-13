package com.rentify.ProjectRentify.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rentify.ProjectRentify.entity.Ubicacion;
import com.rentify.ProjectRentify.repository.UbicacionRepository;
import com.rentify.ProjectRentify.service.UbicacionService;

@Service
public class UbicacionServiceImpl implements UbicacionService {
	
	@Autowired
	private UbicacionRepository ubicacionRepository;

    @Override
    public List<Ubicacion> listarTodos() {
        return ubicacionRepository.findAll();
    }

    @Override
    public Ubicacion buscarPorId(Long id) {
        return ubicacionRepository.findById(id).orElse(null);
    }

    @Override
    public Ubicacion guardar(Ubicacion ubicacion) {
        return ubicacionRepository.save(ubicacion);
    }

    @Override
    public void eliminar(Long id) {
    	ubicacionRepository.deleteById(id);
    }

}
