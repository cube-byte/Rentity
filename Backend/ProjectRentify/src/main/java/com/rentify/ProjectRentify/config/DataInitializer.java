package com.rentify.ProjectRentify.config;

import com.rentify.ProjectRentify.entity.Usuario;
import com.rentify.ProjectRentify.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {
	
	@Bean
    CommandLineRunner initDatabase(UsuarioRepository usuarioRepository) {
        return args -> {
            if (usuarioRepository.count() == 0) {
                
                // Crear usuario administrador de prueba
                Usuario admin = new Usuario();
                admin.setNombre("admin");
                admin.setContrasena("admin123");
                admin.setRol(Usuario.Rol.ADMINISTRADOR);
                admin.setActivo(true);
                usuarioRepository.save(admin);
                
                // Crear usuario cliente de prueba
                Usuario cliente = new Usuario();
                cliente.setNombre("cliente");
                cliente.setContrasena("cliente123");
                cliente.setRol(Usuario.Rol.CLIENTE);
                cliente.setActivo(true);
                usuarioRepository.save(cliente);
                
                System.out.println("Usuarios de prueba creados:");
                System.out.println("ADMIN - Usuario: admin | Contraseña: admin123");
                System.out.println("CLIENTE - Usuario: cliente | Contraseña: cliente123");

            }
        };
    }

}
