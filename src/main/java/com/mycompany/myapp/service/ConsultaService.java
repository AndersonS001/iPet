package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Consulta;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Consulta}.
 */
public interface ConsultaService {
    /**
     * Save a consulta.
     *
     * @param consulta the entity to save.
     * @return the persisted entity.
     */
    Consulta save(Consulta consulta);

    /**
     * Partially updates a consulta.
     *
     * @param consulta the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Consulta> partialUpdate(Consulta consulta);

    /**
     * Get all the consultas.
     *
     * @return the list of entities.
     */
    List<Consulta> findAll();

    /**
     * Get all the consultas with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Consulta> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" consulta.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Consulta> findOne(Long id);

    /**
     * Delete the "id" consulta.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
