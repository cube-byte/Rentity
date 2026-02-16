package com.rentify.ProjectRentify.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="reserva")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reserva {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reserva")
    private Long id;

    private String nombres;
    private String email;
    private String telefono;
    
    private String DNI;

    @ManyToOne
    @JoinColumn(name = "id_auto", nullable = false)
    private Auto auto;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = true)
    private Usuario usuario;

    private LocalDateTime fecha_inicio;
    private LocalDateTime fecha_fin;
    
    private BigDecimal precio_total;
    
    private LocalDateTime fecha;
    private String estado;

}
