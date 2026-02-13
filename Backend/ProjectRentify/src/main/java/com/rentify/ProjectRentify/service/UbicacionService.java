package com.rentify.ProjectRentify.service;

import java.util.List;
import com.rentify.ProjectRentify.entity.Ubicacion;

public interface UbicacionService {
	List<Ubicacion> listarTodos();
    Ubicacion buscarPorId(Long id);
    Ubicacion guardar(Ubicacion ubicacion);
    void eliminar(Long id);

}
