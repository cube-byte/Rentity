package com.rentify.ProjectRentify.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long id;

    @Column(nullable = false, length = 50)
    private String nombres;

    @Column(nullable = false, length = 50)
    private String apellidos;

    @Column(nullable = false, unique = true, length = 12)
    private String documento;

    @Column(nullable = false)
    private String licencia;

    @Column(nullable = false, length = 9)
    private String telefono;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Rol rol;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(nullable = false)
    private LocalDateTime fechaRegistro;

    @ManyToOne
    @JoinColumn(name = "id_ubicacion") // opcional por ahora
    private Ubicacion ubicacion;

    public enum Rol {
        CLIENTE,
        ADMINISTRADOR
    }
}
