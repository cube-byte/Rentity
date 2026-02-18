package com.rentify.ProjectRentify.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Service;

import com.rentify.ProjectRentify.dto.ReservaCreateDTO;
import com.rentify.ProjectRentify.entity.Auto;
import com.rentify.ProjectRentify.entity.Reserva;
import com.rentify.ProjectRentify.entity.Usuario;
import com.rentify.ProjectRentify.entity.Vehiculo;
import com.rentify.ProjectRentify.repository.AutoRepository;
import com.rentify.ProjectRentify.repository.ReservaRepository;
import com.rentify.ProjectRentify.repository.UsuarioRepository;
import com.rentify.ProjectRentify.repository.VehiculoRepository;
import com.rentify.ProjectRentify.service.ReservaService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ReservaImpl implements ReservaService{

    private final ReservaRepository reservaRepo;
    private final VehiculoRepository vehiculoRepo;
    private final AutoRepository autoRepo;
    private final UsuarioRepository usuarioRepo;
    
	
    @Override
    public List<Reserva> listar() {
        return reservaRepo.findAll();
    }
    
    @Override
    public Reserva guardar(ReservaCreateDTO dto) {
    
    	
    	BigDecimal precioBase = obtenerPrecioVehiculo(dto.getIdVehiculo());
        long dias = ChronoUnit.DAYS.between(dto.getFecha_inicio(), dto.getFecha_fin());
        BigDecimal precioTotal = precioBase.multiply(BigDecimal.valueOf(dias));
    	
    	Reserva reserva = new Reserva();
    	
    	reserva.setUsuario(obtenerUsuario(dto.getIdUsuario()));
        reserva.setNombres(dto.getNombres());
        reserva.setEmail(dto.getEmail());
        reserva.setTelefono(dto.getTelefono());
        reserva.setDNI(dto.getDNI());
    	
        
    	reserva.setVehiculo(obtenerVehiculo(dto.getIdVehiculo()));
    	reserva.setAuto(obtenerAuto(dto.getIdAuto()));
    	
    	reserva.setFecha_inicio(dto.getFecha_inicio());
    	reserva.setFecha_fin(dto.getFecha_fin());
    	
    	reserva.setPrecio_total(precioTotal);
        reserva.setFecha(LocalDateTime.now());
        reserva.setEstado("NUEVA");

        return reservaRepo.save(reserva);
    }

    @Override
    public Reserva buscarPorId(Long id) {
        return reservaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrado"));
    }
    
    
    private Vehiculo obtenerVehiculo(Long id) {
        return vehiculoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehiculo no encontrado"));
    }
    
    private Auto obtenerAuto(Long id) {
        return autoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Auto no encontrado"));
    }

    private Usuario obtenerUsuario(Long idUsuario) {
        if (idUsuario == null) return null; 
        return usuarioRepo.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
    
    private BigDecimal obtenerPrecioVehiculo(Long idVehiculo) {
        Vehiculo vehiculo = obtenerVehiculo(idVehiculo); // reutilizamos la función anterior
        return vehiculo.getPrecio(); // suponiendo que tu entidad Vehiculo tiene getPrecio()
    }
    
    

}
