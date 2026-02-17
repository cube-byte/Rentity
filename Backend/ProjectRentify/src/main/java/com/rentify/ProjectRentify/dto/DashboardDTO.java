package com.rentify.ProjectRentify.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    
    // Resumen General
    private Long totalAutos;
    private Long reservasActivas;
    private Long totalUsuarios;
    private Double ingresosMes;
}
