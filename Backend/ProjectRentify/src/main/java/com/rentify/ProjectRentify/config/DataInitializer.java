package com.rentify.ProjectRentify.config;

import com.rentify.ProjectRentify.entity.Usuario;
import com.rentify.ProjectRentify.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initDatabase(UsuarioRepository usuarioRepository) {
        return args -> {

            if (usuarioRepository.count() == 0) {

                // ===== ADMIN =====
                Usuario admin = new Usuario();
                admin.setNombres("Administrador");
                admin.setApellidos("General");
                admin.setDocumento("12345678");
                admin.setLicencia("LIC-ADMIN");
                admin.setTelefono("999999999");
                admin.setEmail("admin@rentify.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRol(Usuario.Rol.ADMINISTRADOR);
                admin.setActivo(true);
                admin.setFechaRegistro(LocalDateTime.now());
                // Si Ubicacion es obligatoria debes asignarla aquí
                // admin.setUbicacion(ubicacionExistente);

                usuarioRepository.save(admin);

                // ===== CLIENTE =====
                Usuario cliente = new Usuario();
                cliente.setNombres("Cliente");
                cliente.setApellidos("Demo");
                cliente.setDocumento("87654321");
                cliente.setLicencia("LIC-CLIENTE");
                cliente.setTelefono("988888888");
                cliente.setEmail("cliente@rentify.com");
                cliente.setPassword(passwordEncoder.encode("cliente123"));
                cliente.setRol(Usuario.Rol.CLIENTE);
                cliente.setActivo(true);
                cliente.setFechaRegistro(LocalDateTime.now());
                // cliente.setUbicacion(ubicacionExistente);

                usuarioRepository.save(cliente);

                System.out.println("Usuarios de prueba creados:");
                System.out.println("ADMIN - Email: admin@rentify.com | Contraseña: admin123");
                System.out.println("CLIENTE - Email: cliente@rentify.com | Contraseña: cliente123");
            }
        };
    }
}
