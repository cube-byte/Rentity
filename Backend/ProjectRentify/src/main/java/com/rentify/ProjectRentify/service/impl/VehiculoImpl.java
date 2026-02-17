package com.rentify.ProjectRentify.service.impl;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.rentify.ProjectRentify.dto.VehiculoCreateDTO;
import com.rentify.ProjectRentify.dto.VehiculoUpdateDTO;
import com.rentify.ProjectRentify.entity.Vehiculo;
import com.rentify.ProjectRentify.repository.VehiculoRepository;
import com.rentify.ProjectRentify.service.VehiculoService;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class VehiculoImpl implements VehiculoService{
	
    // obtiene la ruta base del proyecto
    private final Path rutaBase = Paths.get(System.getProperty("user.dir"))
            .getParent()   // sale de RentifyProyect
            .getParent();  // sale de Backend

    // ruta final hacia Frontend
    private final Path RUTA_IMAGENES =
            rutaBase.resolve("Frontend/recursos/img/autos");

    private final VehiculoRepository repoVehiculo;
	
	
    @Override
    public List<Vehiculo> listar() {
        return repoVehiculo.findAll();
    }
    
    @Override
    public Vehiculo guardar(VehiculoCreateDTO dto, MultipartFile imagen) throws IOException {

    	Vehiculo vehiculo = new Vehiculo();

    	vehiculo.setMarca(dto.getMarca());
    	vehiculo.setModel(dto.getModel());
    	vehiculo.setVersion(dto.getVersion());
    	vehiculo.setYear(dto.getYear());
    	vehiculo.setCategoria(dto.getCategoria());
    	vehiculo.setCarroceria(dto.getCarroceria());
    	vehiculo.setCombustible(dto.getCombustible());
    	vehiculo.setDescripcion(dto.getDescripcion());
    	vehiculo.setPrecio(dto.getPrecio());
    	vehiculo.setEstado("DISPONIBLE");

        if (imagen != null && !imagen.isEmpty()) {

            String nombreArchivo = "car_" +
                    dto.getMarca().toLowerCase().replace(" ", "") + "_" +
                    dto.getModel().toLowerCase().replace(" ", "") + ".jpg";

            Files.createDirectories(RUTA_IMAGENES);
            Path ruta = RUTA_IMAGENES.resolve(nombreArchivo);
            
            imagen.transferTo(ruta.toFile());

            vehiculo.setImagen("/Frontend/recursos/img/autos/" + nombreArchivo);
        }

        return repoVehiculo.save(vehiculo);
    }
    
    @Override
    public Vehiculo buscarPorId(Long id) {
        return repoVehiculo.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehiculo no encontrado"));
    }
    
    @Override
    public Vehiculo actualizar(Long id, VehiculoUpdateDTO dto, MultipartFile imagen) throws IOException {

        Vehiculo vehiculo = buscarPorId(id);

    	vehiculo.setMarca(dto.getMarca());
    	vehiculo.setModel(dto.getModel());
    	vehiculo.setVersion(dto.getVersion());
    	vehiculo.setYear(dto.getYear());
    	vehiculo.setCategoria(dto.getCategoria());
    	vehiculo.setCarroceria(dto.getCarroceria());
    	vehiculo.setCombustible(dto.getCombustible());
    	vehiculo.setDescripcion(dto.getDescripcion());
    	vehiculo.setPrecio(dto.getPrecio());
    	vehiculo.setEstado(dto.getEstado());

        if (imagen != null && !imagen.isEmpty()) {

            String nombreArchivo = "car_" +
            		vehiculo.getMarca().toLowerCase().replace(" ", "") + "_" +
            		vehiculo.getModel().toLowerCase().replace(" ", "") + ".jpg";

            Path ruta = RUTA_IMAGENES.resolve(nombreArchivo);
            
            Files.createDirectories(RUTA_IMAGENES);
            
            imagen.transferTo(ruta.toFile());

            vehiculo.setImagen("/Frontend/recursos/img/autos/" + nombreArchivo);
        }

        return repoVehiculo.save(vehiculo);
    }

    @Override
    public void eliminar(Long id) {
    	repoVehiculo.deleteById(id);
    }
    
}
