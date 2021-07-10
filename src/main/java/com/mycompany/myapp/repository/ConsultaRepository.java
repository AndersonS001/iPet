package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Consulta;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Consulta entity.
 */
@Repository
public interface ConsultaRepository extends JpaRepository<Consulta, Long> {
    @Query(
        value = "select distinct consulta from Consulta consulta left join fetch consulta.remedios left join fetch consulta.exames",
        countQuery = "select count(distinct consulta) from Consulta consulta"
    )
    Page<Consulta> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct consulta from Consulta consulta left join fetch consulta.remedios left join fetch consulta.exames")
    List<Consulta> findAllWithEagerRelationships();

    @Query(
        "select consulta from Consulta consulta left join fetch consulta.remedios left join fetch consulta.exames where consulta.id =:id"
    )
    Optional<Consulta> findOneWithEagerRelationships(@Param("id") Long id);
}
