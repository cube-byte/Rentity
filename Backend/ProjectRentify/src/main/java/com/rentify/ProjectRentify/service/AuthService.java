package com.rentify.ProjectRentify.service;

import com.rentify.ProjectRentify.dto.LoginRequest;
import com.rentify.ProjectRentify.dto.LoginResponse;
import com.rentify.ProjectRentify.entity.Usuario;
import com.rentify.ProjectRentify.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
@RequiredArgsConstructor
public class AuthService {
	
private final UsuarioRepository usuarioRepository;
    
    public LoginResponse login(LoginRequest loginRequest) {
        // Validar que los campos no estén vacíos
        if (loginRequest.getNombre() == null || loginRequest.getNombre().trim().isEmpty()) {
            return new LoginResponse("El nombre de usuario es requerido");
        }
        
        if (loginRequest.getContrasena() == null || loginRequest.getContrasena().trim().isEmpty()) {
            return new LoginResponse("La contraseña es requerida");
        }
        
        // Buscar usuario por nombre y contraseña
        Optional<Usuario> usuarioOpt = usuarioRepository.findByNombreAndContrasena(
            loginRequest.getNombre().trim(),
            loginRequest.getContrasena()
        );
        
        if (usuarioOpt.isEmpty()) {
            return new LoginResponse("Nombre de usuario o contraseña incorrectos");
        }
        
        Usuario usuario = usuarioOpt.get();
        
        // Verificar si el usuario está activo
        if (!usuario.getActivo()) {
            return new LoginResponse("Usuario inactivo. Contacte al administrador");
        }
        
        // Login exitoso
        String mensajeBienvenida = usuario.getRol() == Usuario.Rol.ADMINISTRADOR 
            ? "Bienvenido Administrador" 
            : "Bienvenido Cliente";
            
        return new LoginResponse(usuario, mensajeBienvenida);
    }
    
    public LoginResponse registrarUsuario(Usuario usuario) {
        // Validar que el nombre no esté vacío
        if (usuario.getNombre() == null || usuario.getNombre().trim().isEmpty()) {
            return new LoginResponse("El nombre de usuario es requerido");
        }
        
        // Verificar si el usuario ya existe
        if (usuarioRepository.existsByNombre(usuario.getNombre())) {
            return new LoginResponse("El nombre de usuario ya está en uso");
        }
        
        // Validar contraseña
        if (usuario.getContrasena() == null || usuario.getContrasena().length() < 4) {
            return new LoginResponse("La contraseña debe tener al menos 4 caracteres");
        }
        
        // Si no se especifica rol, por defecto es CLIENTE
        if (usuario.getRol() == null) {
            usuario.setRol(Usuario.Rol.CLIENTE);
        }
        
        // Guardar usuario
        Usuario usuarioGuardado = usuarioRepository.save(usuario);
        
        return new LoginResponse(usuarioGuardado, "Usuario registrado exitosamente");
    }

}
