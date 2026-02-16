package com.rentify.ProjectRentify.service.impl;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.rentify.ProjectRentify.dto.AutoCreateDTO;
import com.rentify.ProjectRentify.dto.AutoUpdateDTO;
import com.rentify.ProjectRentify.entity.Auto;
import com.rentify.ProjectRentify.entity.Vehiculo;
import com.rentify.ProjectRentify.repository.AutoRepository;
import com.rentify.ProjectRentify.repository.VehiculoRepository;
import com.rentify.ProjectRentify.service.AutoService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AutoImpl implements AutoService {


    private final AutoRepository repoAuto;
    private final VehiculoRepository repoVehiculo;

    @Override
    public List<Auto> listar() {
        return repoAuto.findAll();
    }
	
    
    private Vehiculo obtenerVehiculo(Long idVehiculo) {
        return repoVehiculo.findById(idVehiculo)
                .orElseThrow(() -> new RuntimeException("Vehiculo no encontrado"));
    }
    
    @Override
    public Auto guardar(AutoCreateDTO dto) throws IOException {

        Auto auto = new Auto();

        auto.setPlaca(dto.getPlaca());
        auto.setVehiculo(obtenerVehiculo(dto.getVehiculo()));
        auto.setColor(dto.getColor());
        auto.setKilometraje(dto.getKilometraje());
        auto.setEstado("DISPONIBLE");
        auto.setFecha_registro(LocalDateTime.now());

        return repoAuto.save(auto);
    }
    
    @Override
    public Auto buscarPorId(Long id) {
        return repoAuto.findById(id)
                .orElseThrow(() -> new RuntimeException("Auto no encontrado"));
    }
    
    @Override
    public Auto actualizar(Long id, AutoUpdateDTO dto) throws IOException {

        Auto auto = buscarPorId(id);

        auto.setPlaca(dto.getPlaca());
        auto.setVehiculo(obtenerVehiculo(dto.getVehiculo()));
        auto.setColor(dto.getColor());
        auto.setKilometraje(dto.getKilometraje());
        auto.setEstado(dto.getEstado());

        return repoAuto.save(auto);
    }
    
    @Override
    public void eliminar(Long id) {
        repoAuto.deleteById(id);
    }
}
