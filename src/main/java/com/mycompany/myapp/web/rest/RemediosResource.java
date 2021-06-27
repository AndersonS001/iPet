package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Remedios;
import com.mycompany.myapp.repository.RemediosRepository;
import com.mycompany.myapp.service.RemediosService;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Remedios}.
 */
@RestController
@RequestMapping("/api")
public class RemediosResource {

    private final Logger log = LoggerFactory.getLogger(RemediosResource.class);

    private static final String ENTITY_NAME = "remedios";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RemediosService remediosService;

    private final RemediosRepository remediosRepository;

    public RemediosResource(RemediosService remediosService, RemediosRepository remediosRepository) {
        this.remediosService = remediosService;
        this.remediosRepository = remediosRepository;
    }

    /**
     * {@code POST  /remedios} : Create a new remedios.
     *
     * @param remedios the remedios to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new remedios, or with status {@code 400 (Bad Request)} if the remedios has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/remedios")
    public ResponseEntity<Remedios> createRemedios(@RequestBody Remedios remedios) throws URISyntaxException {
        log.debug("REST request to save Remedios : {}", remedios);
        if (remedios.getId() != null) {
            throw new BadRequestAlertException("A new remedios cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Remedios result = remediosService.save(remedios);
        return ResponseEntity
            .created(new URI("/api/remedios/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /remedios/:id} : Updates an existing remedios.
     *
     * @param id the id of the remedios to save.
     * @param remedios the remedios to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated remedios,
     * or with status {@code 400 (Bad Request)} if the remedios is not valid,
     * or with status {@code 500 (Internal Server Error)} if the remedios couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/remedios/{id}")
    public ResponseEntity<Remedios> updateRemedios(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Remedios remedios
    ) throws URISyntaxException {
        log.debug("REST request to update Remedios : {}, {}", id, remedios);
        if (remedios.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, remedios.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!remediosRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Remedios result = remediosService.save(remedios);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, remedios.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /remedios/:id} : Partial updates given fields of an existing remedios, field will ignore if it is null
     *
     * @param id the id of the remedios to save.
     * @param remedios the remedios to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated remedios,
     * or with status {@code 400 (Bad Request)} if the remedios is not valid,
     * or with status {@code 404 (Not Found)} if the remedios is not found,
     * or with status {@code 500 (Internal Server Error)} if the remedios couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/remedios/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Remedios> partialUpdateRemedios(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Remedios remedios
    ) throws URISyntaxException {
        log.debug("REST request to partial update Remedios partially : {}, {}", id, remedios);
        if (remedios.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, remedios.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!remediosRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Remedios> result = remediosService.partialUpdate(remedios);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, remedios.getId().toString())
        );
    }

    /**
     * {@code GET  /remedios} : get all the remedios.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of remedios in body.
     */
    @GetMapping("/remedios")
    public List<Remedios> getAllRemedios() {
        log.debug("REST request to get all Remedios");
        return remediosService.findAll();
    }

    /**
     * {@code GET  /remedios/:id} : get the "id" remedios.
     *
     * @param id the id of the remedios to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the remedios, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/remedios/{id}")
    public ResponseEntity<Remedios> getRemedios(@PathVariable Long id) {
        log.debug("REST request to get Remedios : {}", id);
        Optional<Remedios> remedios = remediosService.findOne(id);
        return ResponseUtil.wrapOrNotFound(remedios);
    }

    /**
     * {@code DELETE  /remedios/:id} : delete the "id" remedios.
     *
     * @param id the id of the remedios to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/remedios/{id}")
    public ResponseEntity<Void> deleteRemedios(@PathVariable Long id) {
        log.debug("REST request to delete Remedios : {}", id);
        remediosService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
