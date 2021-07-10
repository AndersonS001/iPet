package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Convenio;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Convenio entity.
 */
@Repository
public interface ConvenioRepository extends JpaRepository<Convenio, Long> {
    @Query(
        value = "select distinct convenio from Convenio convenio left join fetch convenio.consultas",
        countQuery = "select count(distinct convenio) from Convenio convenio"
    )
    Page<Convenio> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct convenio from Convenio convenio left join fetch convenio.consultas")
    List<Convenio> findAllWithEagerRelationships();

    @Query("select convenio from Convenio convenio left join fetch convenio.consultas where convenio.id =:id")
    Optional<Convenio> findOneWithEagerRelationships(@Param("id") Long id);
}
