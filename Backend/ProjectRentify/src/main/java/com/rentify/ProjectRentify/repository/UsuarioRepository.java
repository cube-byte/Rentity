package com.rentify.ProjectRentify.repository;

import com.rentify.ProjectRentify.entity.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    
    // ===== MÉTODOS PARA AUTENTICACIÓN =====
    
    // Buscar usuario por email (para login)
    Optional<Usuario> findByEmail(String email);
    
    // Verificar si ya existe un email (para registro)
    boolean existsByEmail(String email);
    
    // ===== MÉTODOS PARA ADMIN - BÚSQUEDA Y FILTROS =====
    
    // Buscar por nombre, apellido o email (con paginación)
    Page<Usuario> findByNombresContainingIgnoreCaseOrApellidosContainingIgnoreCaseOrEmailContainingIgnoreCase(
            String nombres, String apellidos, String email, Pageable pageable
    );
    
    // Filtrar por rol
    Page<Usuario> findByRol(Usuario.Rol rol, Pageable pageable);
    
    // Filtrar por estado activo/inactivo
    Page<Usuario> findByActivo(Boolean activo, Pageable pageable);
    
    // Filtrar por rol y estado
    Page<Usuario> findByRolAndActivo(Usuario.Rol rol, Boolean activo, Pageable pageable);
}

