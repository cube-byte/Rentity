package com.rentify.ProjectRentify.service;

import java.util.List;
import com.rentify.ProjectRentify.entity.Region;

public interface RegionService {
	
	List<Region> listarTodos();
    Region buscarPorId(Long id);
    Region guardar(Region region);
    void eliminar(Long id);

}
