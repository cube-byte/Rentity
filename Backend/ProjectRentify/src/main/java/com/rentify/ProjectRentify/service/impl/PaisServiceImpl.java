package com.rentify.ProjectRentify.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rentify.ProjectRentify.entity.Pais;
import com.rentify.ProjectRentify.repository.PaisRepository;
import com.rentify.ProjectRentify.service.PaisService;

@Service
public class PaisServiceImpl implements PaisService {
	
	@Autowired
	private PaisRepository paisRepository;
	
	@Override
	public List<Pais> listarTodos() {
		return paisRepository.findAll();
	}
	
	@Override
    public Pais buscarPorId(Long id) {
        return paisRepository.findById(id).orElse(null);
    }

    @Override
    public Pais guardar(Pais pais) {
        return paisRepository.save(pais);
    }

    @Override
    public void eliminar(Long id) {
    	paisRepository.deleteById(id);
    }

}
