 package com.rentify.ProjectRentify.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.stereotype.Service;

import com.rentify.ProjectRentify.dto.ReservaCreateDTO;
import com.rentify.ProjectRentify.dto.ReservaDTO;
import com.rentify.ProjectRentify.entity.Auto;
import com.rentify.ProjectRentify.entity.Pago;
import com.rentify.ProjectRentify.entity.Reserva;
import com.rentify.ProjectRentify.entity.Usuario;
import com.rentify.ProjectRentify.entity.Vehiculo;
import com.rentify.ProjectRentify.repository.AutoRepository;
import com.rentify.ProjectRentify.repository.PagoRepository;
import com.rentify.ProjectRentify.repository.ReservaRepository;
import com.rentify.ProjectRentify.repository.UsuarioRepository;
import com.rentify.ProjectRentify.repository.VehiculoRepository;
import com.rentify.ProjectRentify.service.ReservaService;

import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ReservaImpl implements ReservaService{

    private final ReservaRepository reservaRepo;
    private final VehiculoRepository vehiculoRepo;
    private final AutoRepository autoRepo;
    private final UsuarioRepository usuarioRepo;
    private final PagoRepository pagoRepo;
    
	
    @Override
    public List<Reserva> listar() {
        return reservaRepo.findAll();
    }
    
    @Override
    @Transactional
    public Reserva guardar(ReservaCreateDTO dto) {
    
    	
        Auto auto = autoRepo.findById(dto.getIdAuto())
                .orElseThrow(() -> new RuntimeException("Auto no encontrado"));

        if (!"DISPONIBLE".equals(auto.getEstado())) {
            throw new RuntimeException("El auto no está disponible para reservar");
        }
    	
    	
        BigDecimal precioBase = obtenerPrecioVehiculo(dto.getIdVehiculo());
        if (precioBase == null) {
            throw new RuntimeException("Vehículo no encontrado");
        }

        long dias = ChronoUnit.DAYS.between(dto.getFecha_inicio(), dto.getFecha_fin());
        if (dias <= 0) dias = 1;

        BigDecimal precioTotal = precioBase.multiply(BigDecimal.valueOf(dias));

        Reserva reserva = new Reserva();

        reserva.setUsuario(obtenerUsuario(dto.getIdUsuario()));

        reserva.setVehiculo(obtenerVehiculo(dto.getIdVehiculo()));
        reserva.setAuto(obtenerAuto(dto.getIdAuto()));

        reserva.setFecha_inicio(dto.getFecha_inicio());
        reserva.setFecha_fin(dto.getFecha_fin());

        reserva.setPrecio_total(precioTotal);
        reserva.setFecha(LocalDateTime.now());
        reserva.setEstado("NUEVA");
        
        auto.setEstado("OCUPADO");
        autoRepo.save(auto);

        Reserva reservaGuardada = reservaRepo.save(reserva);
        
        Pago pago = new Pago();
        pago.setReserva(reservaGuardada);
        pago.setMonto(reserva.getPrecio_total());
        pago.setFecha(LocalDateTime.now());
        pago.setEstado("PENDIENTE");
        
        pagoRepo.save(pago);
        
        return reservaGuardada;
    }

    @Override
    public Reserva buscarPorId(Long id) {
        return reservaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrado"));
    }
    
    @Override
    public List<Reserva> listarPorUsuario(Long idUsuario) {
        return reservaRepo.findByUsuarioId(idUsuario);
    }
    
    private Vehiculo obtenerVehiculo(Long id) {
        return vehiculoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehiculo no encontrado"));
    }
    
    private Auto obtenerAuto(Long id) {
        return autoRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Auto no encontrado"));
        
    }
    
    @Override
    @Transactional
    public Reserva actualizar(Long id, ReservaDTO dto) {
        Reserva reserva = buscarPorId(id);

        reserva.setUsuario(obtenerUsuario(dto.getIdUsuario()));
        reserva.setVehiculo(obtenerVehiculo(dto.getIdVehiculo()));
        reserva.setAuto(obtenerAuto(dto.getIdAuto()));
        reserva.setFecha_inicio(dto.getFecha_inicio());
        reserva.setFecha_fin(dto.getFecha_fin());
        reserva.setPrecio_total(dto.getPrecio_total());
        reserva.setEstado(dto.getEstado());

        return reservaRepo.save(reserva);
    }

    
    
    private Usuario obtenerUsuario(Long id) {
        return usuarioRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
    
    private BigDecimal obtenerPrecioVehiculo(Long idVehiculo) {
        Vehiculo vehiculo = obtenerVehiculo(idVehiculo);
        return vehiculo.getPrecio();
    }
    
    @Override
    @Transactional
    public void cancelar(Long id) {
        Reserva reserva = reservaRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));


        pagoRepo.deleteByReservaId(id);


        Auto auto = reserva.getAuto();
        auto.setEstado("DISPONIBLE");
        autoRepo.save(auto);


        reservaRepo.deleteById(id);
    }
    

}
