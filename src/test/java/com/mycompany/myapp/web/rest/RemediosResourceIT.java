package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Remedios;
import com.mycompany.myapp.domain.enumeration.TipoRemedio;
import com.mycompany.myapp.repository.RemediosRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link RemediosResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RemediosResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_FABRICANTE = "AAAAAAAAAA";
    private static final String UPDATED_FABRICANTE = "BBBBBBBBBB";

    private static final TipoRemedio DEFAULT_TIPO = TipoRemedio.COMPRIMIDO;
    private static final TipoRemedio UPDATED_TIPO = TipoRemedio.LIQUIDO;

    private static final String ENTITY_API_URL = "/api/remedios";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RemediosRepository remediosRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRemediosMockMvc;

    private Remedios remedios;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Remedios createEntity(EntityManager em) {
        Remedios remedios = new Remedios().nome(DEFAULT_NOME).fabricante(DEFAULT_FABRICANTE).tipo(DEFAULT_TIPO);
        return remedios;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Remedios createUpdatedEntity(EntityManager em) {
        Remedios remedios = new Remedios().nome(UPDATED_NOME).fabricante(UPDATED_FABRICANTE).tipo(UPDATED_TIPO);
        return remedios;
    }

    @BeforeEach
    public void initTest() {
        remedios = createEntity(em);
    }

    @Test
    @Transactional
    void createRemedios() throws Exception {
        int databaseSizeBeforeCreate = remediosRepository.findAll().size();
        // Create the Remedios
        restRemediosMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(remedios)))
            .andExpect(status().isCreated());

        // Validate the Remedios in the database
        List<Remedios> remediosList = remediosRepository.findAll();
        assertThat(remediosList).hasSize(databaseSizeBeforeCreate + 1);
        Remedios testRemedios = remediosList.get(remediosList.size() - 1);
        assertThat(testRemedios.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testRemedios.getFabricante()).isEqualTo(DEFAULT_FABRICANTE);
        assertThat(testRemedios.getTipo()).isEqualTo(DEFAULT_TIPO);
    }

    @Test
    @Transactional
    void createRemediosWithExistingId() throws Exception {
        // Create the Remedios with an existing ID
        remedios.setId(1L);

        int databaseSizeBeforeCreate = remediosRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRemediosMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(remedios)))
            .andExpect(status().isBadRequest());

        // Validate the Remedios in the database
        List<Remedios> remediosList = remediosRepository.findAll();
        assertThat(remediosList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllRemedios() throws Exception {
        // Initialize the database
        remediosRepository.saveAndFlush(remedios);

        // Get all the remediosList
        restRemediosMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(remedios.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].fabricante").value(hasItem(DEFAULT_FABRICANTE)))
            .andExpect(jsonPath("$.[*].tipo").value(hasItem(DEFAULT_TIPO.toString())));
    }

    @Test
    @Transactional
    void getRemedios() throws Exception {
        // Initialize the database
        remediosRepository.saveAndFlush(remedios);

        // Get the remedios
        restRemediosMockMvc
            .perform(get(ENTITY_API_URL_ID, remedios.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(remedios.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME))
            .andExpect(jsonPath("$.fabricante").value(DEFAULT_FABRICANTE))
            .andExpect(jsonPath("$.tipo").value(DEFAULT_TIPO.toString()));
    }

    @Test
    @Transactional
    void getNonExistingRemedios() throws Exception {
        // Get the remedios
        restRemediosMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewRemedios() throws Exception {
        // Initialize the database
        remediosRepository.saveAndFlush(remedios);

        int databaseSizeBeforeUpdate = remediosRepository.findAll().size();

        // Update the remedios
        Remedios updatedRemedios = remediosRepository.findById(remedios.getId()).get();
        // Disconnect from session so that the updates on updatedRemedios are not directly saved in db
        em.detach(updatedRemedios);
        updatedRemedios.nome(UPDATED_NOME).fabricante(UPDATED_FABRICANTE).tipo(UPDATED_TIPO);

        restRemediosMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRemedios.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRemedios))
            )
            .andExpect(status().isOk());

        // Validate the Remedios in the database
        List<Remedios> remediosList = remediosRepository.findAll();
        assertThat(remediosList).hasSize(databaseSizeBeforeUpdate);
        Remedios testRemedios = remediosList.get(remediosList.size() - 1);
        assertThat(testRemedios.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testRemedios.getFabricante()).isEqualTo(UPDATED_FABRICANTE);
        assertThat(testRemedios.getTipo()).isEqualTo(UPDATED_TIPO);
    }

    @Test
    @Transactional
    void putNonExistingRemedios() throws Exception {
        int databaseSizeBeforeUpdate = remediosRepository.findAll().size();
        remedios.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRemediosMockMvc
            .perform(
                put(ENTITY_API_URL_ID, remedios.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(remedios))
            )
            .andExpect(status().isBadRequest());

        // Validate the Remedios in the database
        List<Remedios> remediosList = remediosRepository.findAll();
        assertThat(remediosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRemedios() throws Exception {
        int databaseSizeBeforeUpdate = remediosRepository.findAll().size();
        remedios.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRemediosMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(remedios))
            )
            .andExpect(status().isBadRequest());

        // Validate the Remedios in the database
        List<Remedios> remediosList = remediosRepository.findAll();
        assertThat(remediosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRemedios() throws Exception {
        int databaseSizeBeforeUpdate = remediosRepository.findAll().size();
        remedios.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRemediosMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(remedios)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Remedios in the database
        List<Remedios> remediosList = remediosRepository.findAll();
        assertThat(remediosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRemediosWithPatch() throws Exception {
        // Initialize the database
        remediosRepository.saveAndFlush(remedios);

        int databaseSizeBeforeUpdate = remediosRepository.findAll().size();

        // Update the remedios using partial update
        Remedios partialUpdatedRemedios = new Remedios();
        partialUpdatedRemedios.setId(remedios.getId());

        partialUpdatedRemedios.nome(UPDATED_NOME);

        restRemediosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRemedios.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRemedios))
            )
            .andExpect(status().isOk());

        // Validate the Remedios in the database
        List<Remedios> remediosList = remediosRepository.findAll();
        assertThat(remediosList).hasSize(databaseSizeBeforeUpdate);
        Remedios testRemedios = remediosList.get(remediosList.size() - 1);
        assertThat(testRemedios.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testRemedios.getFabricante()).isEqualTo(DEFAULT_FABRICANTE);
        assertThat(testRemedios.getTipo()).isEqualTo(DEFAULT_TIPO);
    }

    @Test
    @Transactional
    void fullUpdateRemediosWithPatch() throws Exception {
        // Initialize the database
        remediosRepository.saveAndFlush(remedios);

        int databaseSizeBeforeUpdate = remediosRepository.findAll().size();

        // Update the remedios using partial update
        Remedios partialUpdatedRemedios = new Remedios();
        partialUpdatedRemedios.setId(remedios.getId());

        partialUpdatedRemedios.nome(UPDATED_NOME).fabricante(UPDATED_FABRICANTE).tipo(UPDATED_TIPO);

        restRemediosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRemedios.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRemedios))
            )
            .andExpect(status().isOk());

        // Validate the Remedios in the database
        List<Remedios> remediosList = remediosRepository.findAll();
        assertThat(remediosList).hasSize(databaseSizeBeforeUpdate);
        Remedios testRemedios = remediosList.get(remediosList.size() - 1);
        assertThat(testRemedios.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testRemedios.getFabricante()).isEqualTo(UPDATED_FABRICANTE);
        assertThat(testRemedios.getTipo()).isEqualTo(UPDATED_TIPO);
    }

    @Test
    @Transactional
    void patchNonExistingRemedios() throws Exception {
        int databaseSizeBeforeUpdate = remediosRepository.findAll().size();
        remedios.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRemediosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, remedios.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(remedios))
            )
            .andExpect(status().isBadRequest());

        // Validate the Remedios in the database
        List<Remedios> remediosList = remediosRepository.findAll();
        assertThat(remediosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRemedios() throws Exception {
        int databaseSizeBeforeUpdate = remediosRepository.findAll().size();
        remedios.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRemediosMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(remedios))
            )
            .andExpect(status().isBadRequest());

        // Validate the Remedios in the database
        List<Remedios> remediosList = remediosRepository.findAll();
        assertThat(remediosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRemedios() throws Exception {
        int databaseSizeBeforeUpdate = remediosRepository.findAll().size();
        remedios.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRemediosMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(remedios)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Remedios in the database
        List<Remedios> remediosList = remediosRepository.findAll();
        assertThat(remediosList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRemedios() throws Exception {
        // Initialize the database
        remediosRepository.saveAndFlush(remedios);

        int databaseSizeBeforeDelete = remediosRepository.findAll().size();

        // Delete the remedios
        restRemediosMockMvc
            .perform(delete(ENTITY_API_URL_ID, remedios.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Remedios> remediosList = remediosRepository.findAll();
        assertThat(remediosList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
