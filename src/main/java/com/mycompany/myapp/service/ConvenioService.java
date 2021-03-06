package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Convenio;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Convenio}.
 */
public interface ConvenioService {
    /**
     * Save a convenio.
     *
     * @param convenio the entity to save.
     * @return the persisted entity.
     */
    Convenio save(Convenio convenio);

    /**
     * Partially updates a convenio.
     *
     * @param convenio the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Convenio> partialUpdate(Convenio convenio);

    /**
     * Get all the convenios.
     *
     * @return the list of entities.
     */
    List<Convenio> findAll();

    /**
     * Get all the convenios with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Convenio> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" convenio.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Convenio> findOne(Long id);

    /**
     * Delete the "id" convenio.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
