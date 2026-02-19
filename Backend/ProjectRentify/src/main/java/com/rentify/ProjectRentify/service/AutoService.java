package com.rentify.ProjectRentify.service;

import java.io.IOException;
import java.util.List;


import com.rentify.ProjectRentify.dto.AutoCreateDTO;
import com.rentify.ProjectRentify.dto.AutoUpdateDTO;
import com.rentify.ProjectRentify.entity.Auto;

public interface AutoService {

    List<Auto> listar();

    Auto guardar(AutoCreateDTO dto) throws IOException;

    Auto buscarPorId(Long id);

    Auto actualizar(Long id, AutoUpdateDTO dto) throws IOException;

    void eliminar(Long id);
    
    List<Auto> buscarConFiltros(String marca, String modelo);
    
}
