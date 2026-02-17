package com.rentify.ProjectRentify.controller;

import com.rentify.ProjectRentify.dto.DashboardDTO;
import com.rentify.ProjectRentify.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DashboardController {
    
    private final DashboardService dashboardService;
    
    /**
     * Obtener estadísticas del dashboard
     * GET /api/admin/dashboard
     */
    @GetMapping
    public ResponseEntity<DashboardDTO> obtenerEstadisticas() {
        DashboardDTO dashboard = dashboardService.obtenerEstadisticas();
        return ResponseEntity.ok(dashboard);
    }
}