package com.rentify.ProjectRentify.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.rentify.ProjectRentify.entity.Auto;
import java.util.List;

public interface AutoRepository extends JpaRepository<Auto, Long> {

    @Query("SELECT a FROM Auto a WHERE " +
           "(:marca IS NULL OR LOWER(a.vehiculo.marca) LIKE LOWER(CONCAT('%', :marca, '%'))) AND " +
           "(:modelo IS NULL OR LOWER(a.vehiculo.model) LIKE LOWER(CONCAT('%', :modelo, '%')))")
    List<Auto> buscarConFiltros(@Param("marca") String marca, @Param("modelo") String modelo);
}
