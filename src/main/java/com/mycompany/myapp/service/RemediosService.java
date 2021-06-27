package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Remedios;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Remedios}.
 */
public interface RemediosService {
    /**
     * Save a remedios.
     *
     * @param remedios the entity to save.
     * @return the persisted entity.
     */
    Remedios save(Remedios remedios);

    /**
     * Partially updates a remedios.
     *
     * @param remedios the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Remedios> partialUpdate(Remedios remedios);

    /**
     * Get all the remedios.
     *
     * @return the list of entities.
     */
    List<Remedios> findAll();

    /**
     * Get the "id" remedios.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Remedios> findOne(Long id);

    /**
     * Delete the "id" remedios.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
