package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Pet;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Pet entity.
 */
@Repository
public interface PetRepository extends JpaRepository<Pet, Long> {
    @Query(
        value = "select distinct pet from Pet pet left join fetch pet.convenios left join fetch pet.vacinas left join fetch pet.consultas",
        countQuery = "select count(distinct pet) from Pet pet"
    )
    Page<Pet> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct pet from Pet pet left join fetch pet.convenios left join fetch pet.vacinas left join fetch pet.consultas")
    List<Pet> findAllWithEagerRelationships();

    @Query(
        "select pet from Pet pet left join fetch pet.convenios left join fetch pet.vacinas left join fetch pet.consultas where pet.id =:id"
    )
    Optional<Pet> findOneWithEagerRelationships(@Param("id") Long id);
}
