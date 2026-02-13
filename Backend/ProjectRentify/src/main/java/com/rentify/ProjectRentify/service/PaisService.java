package com.rentify.ProjectRentify.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.rentify.ProjectRentify.entity.Pais;

@Service
public interface PaisService {
	
	List<Pais> listarTodos();
	Pais buscarPorId(Long id);
	Pais guardar(Pais pais);
    void eliminar(Long id);

}
