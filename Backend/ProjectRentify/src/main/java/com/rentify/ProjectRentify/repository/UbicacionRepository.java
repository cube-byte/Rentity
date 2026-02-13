package com.rentify.ProjectRentify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.rentify.ProjectRentify.entity.Ubicacion;


@Repository
public interface UbicacionRepository extends JpaRepository<Ubicacion, Long> {

}
