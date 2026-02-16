package com.rentify.ProjectRentify.repository;

import com.rentify.ProjectRentify.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Buscar usuario por email (para login)
    Optional<Usuario> findByEmail(String email);

    // Verificar si ya existe un email (para registro)
    boolean existsByEmail(String email);

}

