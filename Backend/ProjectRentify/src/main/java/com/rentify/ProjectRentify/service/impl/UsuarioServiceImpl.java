package com.rentify.ProjectRentify.service.impl;

import com.rentify.ProjectRentify.entity.Usuario;
import com.rentify.ProjectRentify.repository.UsuarioRepository;
import com.rentify.ProjectRentify.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {
    
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public Page<Usuario> listarTodos(Pageable pageable) {
        return usuarioRepository.findAll(pageable);
    }
    
    @Override
    public Page<Usuario> buscarConFiltros(String search, String rol, Boolean activo, Pageable pageable) {
        // Si hay búsqueda por texto
        if (search != null && !search.isEmpty()) {
            return usuarioRepository.findByNombresContainingIgnoreCaseOrApellidosContainingIgnoreCaseOrEmailContainingIgnoreCase(
                    search, search, search, pageable
            );
        }
        
        // Si hay filtro por rol y activo
        if (rol != null && !rol.isEmpty() && activo != null) {
            return usuarioRepository.findByRolAndActivo(Usuario.Rol.valueOf(rol), activo, pageable);
        }
        
        // Si solo hay filtro por rol
        if (rol != null && !rol.isEmpty()) {
            return usuarioRepository.findByRol(Usuario.Rol.valueOf(rol), pageable);
        }
        
        // Si solo hay filtro por activo
        if (activo != null) {
            return usuarioRepository.findByActivo(activo, pageable);
        }
        
        // Si no hay filtros, retornar todos
        return usuarioRepository.findAll(pageable);
    }
    
    @Override
    public Usuario obtenerPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con ID: " + id));
    }
    
    @Override
    public Usuario crear(Usuario usuario) {
        // Verificar si el email ya existe
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }
        
        // VALIDAR QUE EL PASSWORD NO SEA NULO O VACÍO
        if (usuario.getPassword() == null || usuario.getPassword().isEmpty()) {
            throw new RuntimeException("La contraseña es obligatoria");
        }
        
        // Encriptar la contraseña
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        
        // Establecer fecha de registro
        usuario.setFechaRegistro(LocalDateTime.now());
        
        // Guardar y retornar
        return usuarioRepository.save(usuario);
    }
    
    @Override
    public Usuario actualizar(Long id, Usuario usuarioActualizado) {
        Usuario usuarioExistente = obtenerPorId(id);
        
        // Actualizar campos
        usuarioExistente.setNombres(usuarioActualizado.getNombres());
        usuarioExistente.setApellidos(usuarioActualizado.getApellidos());
        usuarioExistente.setDocumento(usuarioActualizado.getDocumento());
        usuarioExistente.setLicencia(usuarioActualizado.getLicencia());
        usuarioExistente.setTelefono(usuarioActualizado.getTelefono());
        usuarioExistente.setRol(usuarioActualizado.getRol());
        usuarioExistente.setActivo(usuarioActualizado.getActivo());
        
        // Solo actualizar email si cambió y no existe
        if (!usuarioExistente.getEmail().equals(usuarioActualizado.getEmail())) {
            if (usuarioRepository.existsByEmail(usuarioActualizado.getEmail())) {
                throw new RuntimeException("El email ya está en uso");
            }
            usuarioExistente.setEmail(usuarioActualizado.getEmail());
        }
        
        // Solo actualizar password si se proporcionó uno nuevo
        if (usuarioActualizado.getPassword() != null && !usuarioActualizado.getPassword().isEmpty()) {
            usuarioExistente.setPassword(passwordEncoder.encode(usuarioActualizado.getPassword()));
        }
        
        return usuarioRepository.save(usuarioExistente);
    }
    
    @Override
    public void eliminar(Long id) {
        Usuario usuario = obtenerPorId(id);
        usuarioRepository.delete(usuario);
    }
}