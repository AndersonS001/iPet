package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Exame;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Exame}.
 */
public interface ExameService {
    /**
     * Save a exame.
     *
     * @param exame the entity to save.
     * @return the persisted entity.
     */
    Exame save(Exame exame);

    /**
     * Partially updates a exame.
     *
     * @param exame the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Exame> partialUpdate(Exame exame);

    /**
     * Get all the exames.
     *
     * @return the list of entities.
     */
    List<Exame> findAll();

    /**
     * Get the "id" exame.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Exame> findOne(Long id);

    /**
     * Delete the "id" exame.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
