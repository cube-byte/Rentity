package com.rentify.ProjectRentify.service;

import com.rentify.ProjectRentify.entity.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UsuarioService {
    
    // Listar todos con paginación
    Page<Usuario> listarTodos(Pageable pageable);
    
    // Buscar con filtros
    Page<Usuario> buscarConFiltros(String search, String rol, Boolean activo, Pageable pageable);
    
    // Obtener por ID
    Usuario obtenerPorId(Long id);
    
    // Crear usuario
    Usuario crear(Usuario usuario);
    
    // Actualizar usuario
    Usuario actualizar(Long id, Usuario usuario);
    
    // Eliminar usuario
    void eliminar(Long id);
}
