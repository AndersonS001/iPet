package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Convenio;
import com.mycompany.myapp.repository.ConvenioRepository;
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
 * Integration tests for the {@link ConvenioResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ConvenioResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final Double DEFAULT_VALOR = 1D;
    private static final Double UPDATED_VALOR = 2D;

    private static final String ENTITY_API_URL = "/api/convenios";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ConvenioRepository convenioRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restConvenioMockMvc;

    private Convenio convenio;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Convenio createEntity(EntityManager em) {
        Convenio convenio = new Convenio().nome(DEFAULT_NOME).email(DEFAULT_EMAIL).valor(DEFAULT_VALOR);
        return convenio;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Convenio createUpdatedEntity(EntityManager em) {
        Convenio convenio = new Convenio().nome(UPDATED_NOME).email(UPDATED_EMAIL).valor(UPDATED_VALOR);
        return convenio;
    }

    @BeforeEach
    public void initTest() {
        convenio = createEntity(em);
    }

    @Test
    @Transactional
    void createConvenio() throws Exception {
        int databaseSizeBeforeCreate = convenioRepository.findAll().size();
        // Create the Convenio
        restConvenioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(convenio)))
            .andExpect(status().isCreated());

        // Validate the Convenio in the database
        List<Convenio> convenioList = convenioRepository.findAll();
        assertThat(convenioList).hasSize(databaseSizeBeforeCreate + 1);
        Convenio testConvenio = convenioList.get(convenioList.size() - 1);
        assertThat(testConvenio.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testConvenio.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testConvenio.getValor()).isEqualTo(DEFAULT_VALOR);
    }

    @Test
    @Transactional
    void createConvenioWithExistingId() throws Exception {
        // Create the Convenio with an existing ID
        convenio.setId(1L);

        int databaseSizeBeforeCreate = convenioRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restConvenioMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(convenio)))
            .andExpect(status().isBadRequest());

        // Validate the Convenio in the database
        List<Convenio> convenioList = convenioRepository.findAll();
        assertThat(convenioList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllConvenios() throws Exception {
        // Initialize the database
        convenioRepository.saveAndFlush(convenio);

        // Get all the convenioList
        restConvenioMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(convenio.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].valor").value(hasItem(DEFAULT_VALOR.doubleValue())));
    }

    @Test
    @Transactional
    void getConvenio() throws Exception {
        // Initialize the database
        convenioRepository.saveAndFlush(convenio);

        // Get the convenio
        restConvenioMockMvc
            .perform(get(ENTITY_API_URL_ID, convenio.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(convenio.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.valor").value(DEFAULT_VALOR.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingConvenio() throws Exception {
        // Get the convenio
        restConvenioMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewConvenio() throws Exception {
        // Initialize the database
        convenioRepository.saveAndFlush(convenio);

        int databaseSizeBeforeUpdate = convenioRepository.findAll().size();

        // Update the convenio
        Convenio updatedConvenio = convenioRepository.findById(convenio.getId()).get();
        // Disconnect from session so that the updates on updatedConvenio are not directly saved in db
        em.detach(updatedConvenio);
        updatedConvenio.nome(UPDATED_NOME).email(UPDATED_EMAIL).valor(UPDATED_VALOR);

        restConvenioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedConvenio.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedConvenio))
            )
            .andExpect(status().isOk());

        // Validate the Convenio in the database
        List<Convenio> convenioList = convenioRepository.findAll();
        assertThat(convenioList).hasSize(databaseSizeBeforeUpdate);
        Convenio testConvenio = convenioList.get(convenioList.size() - 1);
        assertThat(testConvenio.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testConvenio.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testConvenio.getValor()).isEqualTo(UPDATED_VALOR);
    }

    @Test
    @Transactional
    void putNonExistingConvenio() throws Exception {
        int databaseSizeBeforeUpdate = convenioRepository.findAll().size();
        convenio.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConvenioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, convenio.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(convenio))
            )
            .andExpect(status().isBadRequest());

        // Validate the Convenio in the database
        List<Convenio> convenioList = convenioRepository.findAll();
        assertThat(convenioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchConvenio() throws Exception {
        int databaseSizeBeforeUpdate = convenioRepository.findAll().size();
        convenio.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConvenioMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(convenio))
            )
            .andExpect(status().isBadRequest());

        // Validate the Convenio in the database
        List<Convenio> convenioList = convenioRepository.findAll();
        assertThat(convenioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamConvenio() throws Exception {
        int databaseSizeBeforeUpdate = convenioRepository.findAll().size();
        convenio.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConvenioMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(convenio)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Convenio in the database
        List<Convenio> convenioList = convenioRepository.findAll();
        assertThat(convenioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateConvenioWithPatch() throws Exception {
        // Initialize the database
        convenioRepository.saveAndFlush(convenio);

        int databaseSizeBeforeUpdate = convenioRepository.findAll().size();

        // Update the convenio using partial update
        Convenio partialUpdatedConvenio = new Convenio();
        partialUpdatedConvenio.setId(convenio.getId());

        partialUpdatedConvenio.valor(UPDATED_VALOR);

        restConvenioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConvenio.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConvenio))
            )
            .andExpect(status().isOk());

        // Validate the Convenio in the database
        List<Convenio> convenioList = convenioRepository.findAll();
        assertThat(convenioList).hasSize(databaseSizeBeforeUpdate);
        Convenio testConvenio = convenioList.get(convenioList.size() - 1);
        assertThat(testConvenio.getNome()).isEqualTo(DEFAULT_NOME);
        assertThat(testConvenio.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testConvenio.getValor()).isEqualTo(UPDATED_VALOR);
    }

    @Test
    @Transactional
    void fullUpdateConvenioWithPatch() throws Exception {
        // Initialize the database
        convenioRepository.saveAndFlush(convenio);

        int databaseSizeBeforeUpdate = convenioRepository.findAll().size();

        // Update the convenio using partial update
        Convenio partialUpdatedConvenio = new Convenio();
        partialUpdatedConvenio.setId(convenio.getId());

        partialUpdatedConvenio.nome(UPDATED_NOME).email(UPDATED_EMAIL).valor(UPDATED_VALOR);

        restConvenioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConvenio.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConvenio))
            )
            .andExpect(status().isOk());

        // Validate the Convenio in the database
        List<Convenio> convenioList = convenioRepository.findAll();
        assertThat(convenioList).hasSize(databaseSizeBeforeUpdate);
        Convenio testConvenio = convenioList.get(convenioList.size() - 1);
        assertThat(testConvenio.getNome()).isEqualTo(UPDATED_NOME);
        assertThat(testConvenio.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testConvenio.getValor()).isEqualTo(UPDATED_VALOR);
    }

    @Test
    @Transactional
    void patchNonExistingConvenio() throws Exception {
        int databaseSizeBeforeUpdate = convenioRepository.findAll().size();
        convenio.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConvenioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, convenio.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(convenio))
            )
            .andExpect(status().isBadRequest());

        // Validate the Convenio in the database
        List<Convenio> convenioList = convenioRepository.findAll();
        assertThat(convenioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchConvenio() throws Exception {
        int databaseSizeBeforeUpdate = convenioRepository.findAll().size();
        convenio.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConvenioMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(convenio))
            )
            .andExpect(status().isBadRequest());

        // Validate the Convenio in the database
        List<Convenio> convenioList = convenioRepository.findAll();
        assertThat(convenioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamConvenio() throws Exception {
        int databaseSizeBeforeUpdate = convenioRepository.findAll().size();
        convenio.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConvenioMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(convenio)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Convenio in the database
        List<Convenio> convenioList = convenioRepository.findAll();
        assertThat(convenioList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteConvenio() throws Exception {
        // Initialize the database
        convenioRepository.saveAndFlush(convenio);

        int databaseSizeBeforeDelete = convenioRepository.findAll().size();

        // Delete the convenio
        restConvenioMockMvc
            .perform(delete(ENTITY_API_URL_ID, convenio.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Convenio> convenioList = convenioRepository.findAll();
        assertThat(convenioList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
