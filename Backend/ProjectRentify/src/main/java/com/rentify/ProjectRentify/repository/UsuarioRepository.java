package com.rentify.ProjectRentify.repository;

import com.rentify.ProjectRentify.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
	
	Optional<Usuario> findByNombre(String nombre);
    Optional<Usuario> findByNombreAndContrasena(String nombre, String contrasena);
    
    boolean existsByNombre(String nombre);

}
