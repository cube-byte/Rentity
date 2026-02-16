package com.rentify.ProjectRentify.service.impl;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.rentify.ProjectRentify.entity.Region;
import com.rentify.ProjectRentify.repository.RegionRepository;
import com.rentify.ProjectRentify.service.RegionService;

@Service
public class RegionServiceImpl implements RegionService {
	
	@Autowired
    private RegionRepository regionRepository;

    @Override
    public List<Region> listarTodos() {
        return regionRepository.findAll();
    }

    @Override
    public Region buscarPorId(Long id) {
        return regionRepository.findById(id).orElse(null);
    }

    @Override
    public Region guardar(Region region) {
        return regionRepository.save(region);
    }

    @Override
    public void eliminar(Long id) {
        regionRepository.deleteById(id);
    }

}
