package com.rentify.ProjectRentify.dto;

import java.math.BigDecimal;

import lombok.Data;

@Data
public class PagoDTO {

    private Long idReserva;
    private BigDecimal monto;
    private String metodo;
    private String estado;
	
}
