package com.rentify.ProjectRentify.service;

import com.rentify.ProjectRentify.dto.DashboardDTO;
import com.rentify.ProjectRentify.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {
    
    private final UsuarioRepository usuarioRepository;
    // Inyecta aquí los otros repositorios cuando los tengas:
    // private final AutoRepository autoRepository;
    // private final ReservaRepository reservaRepository;
    // private final PagoRepository pagoRepository;
    
    public DashboardDTO obtenerEstadisticas() {
        
        // === ESTADÍSTICAS DE USUARIOS ===
        Long totalUsuarios = usuarioRepository.count();
        
        // === ESTADÍSTICAS DE AUTOS ===
        // Cuando tengas el repositorio de Auto, descomentar:
        // Long totalAutos = autoRepository.count();
        Long totalAutos = 0L; // Valor temporal
        
        // === ESTADÍSTICAS DE RESERVAS ===
        // Cuando tengas el repositorio de Reserva, descomentar:
        // Long reservasActivas = reservaRepository.countByEstado("ACTIVA");
        Long reservasActivas = 0L; // Valor temporal
        
        // === ESTADÍSTICAS DE PAGOS ===
        // Cuando tengas el repositorio de Pago, descomentar:
        // Double ingresosMes = pagoRepository.sumIngresosMesActual();
        Double ingresosMes = 0.0; // Valor temporal
        
        return DashboardDTO.builder()
                .totalAutos(totalAutos)
                .reservasActivas(reservasActivas)
                .totalUsuarios(totalUsuarios)
                .ingresosMes(ingresosMes)
                .build();
    }
}