package com.rentify.ProjectRentify.service;

import java.io.IOException;
import java.util.List;
import com.rentify.ProjectRentify.dto.UbicacionDTO;
import com.rentify.ProjectRentify.entity.Ubicacion;

public interface UbicacionService {
    List<Ubicacion> listar();
    Ubicacion guardar(UbicacionDTO dto) throws IOException;
    Ubicacion actualizar(Long id, UbicacionDTO dto) throws IOException;
    void eliminar(Long id);
}