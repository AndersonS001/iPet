package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Vacina;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Vacina}.
 */
public interface VacinaService {
    /**
     * Save a vacina.
     *
     * @param vacina the entity to save.
     * @return the persisted entity.
     */
    Vacina save(Vacina vacina);

    /**
     * Partially updates a vacina.
     *
     * @param vacina the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Vacina> partialUpdate(Vacina vacina);

    /**
     * Get all the vacinas.
     *
     * @return the list of entities.
     */
    List<Vacina> findAll();

    /**
     * Get the "id" vacina.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Vacina> findOne(Long id);

    /**
     * Delete the "id" vacina.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
