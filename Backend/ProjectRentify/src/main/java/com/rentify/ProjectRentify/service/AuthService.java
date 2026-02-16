package com.rentify.ProjectRentify.service;

import com.rentify.ProjectRentify.dto.LoginRequest;
import com.rentify.ProjectRentify.dto.LoginResponse;
import com.rentify.ProjectRentify.entity.Usuario;
import com.rentify.ProjectRentify.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public LoginResponse login(LoginRequest loginRequest) {

        if (loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty()) {
            return new LoginResponse("El email es requerido");
        }

        if (loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
            return new LoginResponse("La contraseña es requerida");
        }

        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(loginRequest.getEmail().trim());

        if (usuarioOpt.isEmpty()) {
            return new LoginResponse("Email o contraseña incorrectos");
        }

        Usuario usuario = usuarioOpt.get();

        // Validar contraseña encriptada
        if (!passwordEncoder.matches(loginRequest.getPassword(), usuario.getPassword())) {
            return new LoginResponse("Email o contraseña incorrectos");
        }

        if (!usuario.getActivo()) {
            return new LoginResponse("Usuario inactivo. Contacte al administrador");
        }

        String mensajeBienvenida = usuario.getRol() == Usuario.Rol.ADMINISTRADOR
                ? "Bienvenido Administrador"
                : "Bienvenido Cliente";

        return new LoginResponse(usuario, mensajeBienvenida);
    }

    public LoginResponse registrarUsuario(Usuario usuario) {

        if (usuario.getEmail() == null || usuario.getEmail().trim().isEmpty()) {
            return new LoginResponse("El email es requerido");
        }

        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            return new LoginResponse("El email ya está en uso");
        }

        if (usuario.getPassword() == null || usuario.getPassword().length() < 6) {
            return new LoginResponse("La contraseña debe tener al menos 6 caracteres");
        }

        // Encriptar contraseña
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

        if (usuario.getRol() == null) {
            usuario.setRol(Usuario.Rol.CLIENTE);
        }

        usuario.setActivo(true);
        usuario.setFechaRegistro(LocalDateTime.now());

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        return new LoginResponse(usuarioGuardado, "Usuario registrado exitosamente");
    }
}
