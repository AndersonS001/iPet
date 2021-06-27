package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Exame;
import com.mycompany.myapp.repository.ExameRepository;
import com.mycompany.myapp.service.ExameService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Exame}.
 */
@RestController
@RequestMapping("/api")
public class ExameResource {

    private final Logger log = LoggerFactory.getLogger(ExameResource.class);

    private static final String ENTITY_NAME = "exame";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ExameService exameService;

    private final ExameRepository exameRepository;

    public ExameResource(ExameService exameService, ExameRepository exameRepository) {
        this.exameService = exameService;
        this.exameRepository = exameRepository;
    }

    /**
     * {@code POST  /exames} : Create a new exame.
     *
     * @param exame the exame to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new exame, or with status {@code 400 (Bad Request)} if the exame has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/exames")
    public ResponseEntity<Exame> createExame(@RequestBody Exame exame) throws URISyntaxException {
        log.debug("REST request to save Exame : {}", exame);
        if (exame.getId() != null) {
            throw new BadRequestAlertException("A new exame cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Exame result = exameService.save(exame);
        return ResponseEntity
            .created(new URI("/api/exames/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /exames/:id} : Updates an existing exame.
     *
     * @param id the id of the exame to save.
     * @param exame the exame to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated exame,
     * or with status {@code 400 (Bad Request)} if the exame is not valid,
     * or with status {@code 500 (Internal Server Error)} if the exame couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/exames/{id}")
    public ResponseEntity<Exame> updateExame(@PathVariable(value = "id", required = false) final Long id, @RequestBody Exame exame)
        throws URISyntaxException {
        log.debug("REST request to update Exame : {}, {}", id, exame);
        if (exame.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, exame.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!exameRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Exame result = exameService.save(exame);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, exame.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /exames/:id} : Partial updates given fields of an existing exame, field will ignore if it is null
     *
     * @param id the id of the exame to save.
     * @param exame the exame to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated exame,
     * or with status {@code 400 (Bad Request)} if the exame is not valid,
     * or with status {@code 404 (Not Found)} if the exame is not found,
     * or with status {@code 500 (Internal Server Error)} if the exame couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/exames/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Exame> partialUpdateExame(@PathVariable(value = "id", required = false) final Long id, @RequestBody Exame exame)
        throws URISyntaxException {
        log.debug("REST request to partial update Exame partially : {}, {}", id, exame);
        if (exame.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, exame.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!exameRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Exame> result = exameService.partialUpdate(exame);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, exame.getId().toString())
        );
    }

    /**
     * {@code GET  /exames} : get all the exames.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of exames in body.
     */
    @GetMapping("/exames")
    public List<Exame> getAllExames() {
        log.debug("REST request to get all Exames");
        return exameService.findAll();
    }

    /**
     * {@code GET  /exames/:id} : get the "id" exame.
     *
     * @param id the id of the exame to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the exame, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/exames/{id}")
    public ResponseEntity<Exame> getExame(@PathVariable Long id) {
        log.debug("REST request to get Exame : {}", id);
        Optional<Exame> exame = exameService.findOne(id);
        return ResponseUtil.wrapOrNotFound(exame);
    }

    /**
     * {@code DELETE  /exames/:id} : delete the "id" exame.
     *
     * @param id the id of the exame to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/exames/{id}")
    public ResponseEntity<Void> deleteExame(@PathVariable Long id) {
        log.debug("REST request to delete Exame : {}", id);
        exameService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
