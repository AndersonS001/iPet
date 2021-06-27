package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Consulta;
import com.mycompany.myapp.repository.ConsultaRepository;
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
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link ConsultaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ConsultaResourceIT {

    private static final String DEFAULT_ESPECIALIDADE = "AAAAAAAAAA";
    private static final String UPDATED_ESPECIALIDADE = "BBBBBBBBBB";

    private static final String DEFAULT_MEDICO = "AAAAAAAAAA";
    private static final String UPDATED_MEDICO = "BBBBBBBBBB";

    private static final Double DEFAULT_VALOR = 1D;
    private static final Double UPDATED_VALOR = 2D;

    private static final byte[] DEFAULT_RECEITA = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_RECEITA = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_RECEITA_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_RECEITA_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/consultas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ConsultaRepository consultaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restConsultaMockMvc;

    private Consulta consulta;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Consulta createEntity(EntityManager em) {
        Consulta consulta = new Consulta()
            .especialidade(DEFAULT_ESPECIALIDADE)
            .medico(DEFAULT_MEDICO)
            .valor(DEFAULT_VALOR)
            .receita(DEFAULT_RECEITA)
            .receitaContentType(DEFAULT_RECEITA_CONTENT_TYPE);
        return consulta;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Consulta createUpdatedEntity(EntityManager em) {
        Consulta consulta = new Consulta()
            .especialidade(UPDATED_ESPECIALIDADE)
            .medico(UPDATED_MEDICO)
            .valor(UPDATED_VALOR)
            .receita(UPDATED_RECEITA)
            .receitaContentType(UPDATED_RECEITA_CONTENT_TYPE);
        return consulta;
    }

    @BeforeEach
    public void initTest() {
        consulta = createEntity(em);
    }

    @Test
    @Transactional
    void createConsulta() throws Exception {
        int databaseSizeBeforeCreate = consultaRepository.findAll().size();
        // Create the Consulta
        restConsultaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(consulta)))
            .andExpect(status().isCreated());

        // Validate the Consulta in the database
        List<Consulta> consultaList = consultaRepository.findAll();
        assertThat(consultaList).hasSize(databaseSizeBeforeCreate + 1);
        Consulta testConsulta = consultaList.get(consultaList.size() - 1);
        assertThat(testConsulta.getEspecialidade()).isEqualTo(DEFAULT_ESPECIALIDADE);
        assertThat(testConsulta.getMedico()).isEqualTo(DEFAULT_MEDICO);
        assertThat(testConsulta.getValor()).isEqualTo(DEFAULT_VALOR);
        assertThat(testConsulta.getReceita()).isEqualTo(DEFAULT_RECEITA);
        assertThat(testConsulta.getReceitaContentType()).isEqualTo(DEFAULT_RECEITA_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createConsultaWithExistingId() throws Exception {
        // Create the Consulta with an existing ID
        consulta.setId(1L);

        int databaseSizeBeforeCreate = consultaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restConsultaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(consulta)))
            .andExpect(status().isBadRequest());

        // Validate the Consulta in the database
        List<Consulta> consultaList = consultaRepository.findAll();
        assertThat(consultaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllConsultas() throws Exception {
        // Initialize the database
        consultaRepository.saveAndFlush(consulta);

        // Get all the consultaList
        restConsultaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(consulta.getId().intValue())))
            .andExpect(jsonPath("$.[*].especialidade").value(hasItem(DEFAULT_ESPECIALIDADE)))
            .andExpect(jsonPath("$.[*].medico").value(hasItem(DEFAULT_MEDICO)))
            .andExpect(jsonPath("$.[*].valor").value(hasItem(DEFAULT_VALOR.doubleValue())))
            .andExpect(jsonPath("$.[*].receitaContentType").value(hasItem(DEFAULT_RECEITA_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].receita").value(hasItem(Base64Utils.encodeToString(DEFAULT_RECEITA))));
    }

    @Test
    @Transactional
    void getConsulta() throws Exception {
        // Initialize the database
        consultaRepository.saveAndFlush(consulta);

        // Get the consulta
        restConsultaMockMvc
            .perform(get(ENTITY_API_URL_ID, consulta.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(consulta.getId().intValue()))
            .andExpect(jsonPath("$.especialidade").value(DEFAULT_ESPECIALIDADE))
            .andExpect(jsonPath("$.medico").value(DEFAULT_MEDICO))
            .andExpect(jsonPath("$.valor").value(DEFAULT_VALOR.doubleValue()))
            .andExpect(jsonPath("$.receitaContentType").value(DEFAULT_RECEITA_CONTENT_TYPE))
            .andExpect(jsonPath("$.receita").value(Base64Utils.encodeToString(DEFAULT_RECEITA)));
    }

    @Test
    @Transactional
    void getNonExistingConsulta() throws Exception {
        // Get the consulta
        restConsultaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewConsulta() throws Exception {
        // Initialize the database
        consultaRepository.saveAndFlush(consulta);

        int databaseSizeBeforeUpdate = consultaRepository.findAll().size();

        // Update the consulta
        Consulta updatedConsulta = consultaRepository.findById(consulta.getId()).get();
        // Disconnect from session so that the updates on updatedConsulta are not directly saved in db
        em.detach(updatedConsulta);
        updatedConsulta
            .especialidade(UPDATED_ESPECIALIDADE)
            .medico(UPDATED_MEDICO)
            .valor(UPDATED_VALOR)
            .receita(UPDATED_RECEITA)
            .receitaContentType(UPDATED_RECEITA_CONTENT_TYPE);

        restConsultaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedConsulta.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedConsulta))
            )
            .andExpect(status().isOk());

        // Validate the Consulta in the database
        List<Consulta> consultaList = consultaRepository.findAll();
        assertThat(consultaList).hasSize(databaseSizeBeforeUpdate);
        Consulta testConsulta = consultaList.get(consultaList.size() - 1);
        assertThat(testConsulta.getEspecialidade()).isEqualTo(UPDATED_ESPECIALIDADE);
        assertThat(testConsulta.getMedico()).isEqualTo(UPDATED_MEDICO);
        assertThat(testConsulta.getValor()).isEqualTo(UPDATED_VALOR);
        assertThat(testConsulta.getReceita()).isEqualTo(UPDATED_RECEITA);
        assertThat(testConsulta.getReceitaContentType()).isEqualTo(UPDATED_RECEITA_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingConsulta() throws Exception {
        int databaseSizeBeforeUpdate = consultaRepository.findAll().size();
        consulta.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConsultaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, consulta.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(consulta))
            )
            .andExpect(status().isBadRequest());

        // Validate the Consulta in the database
        List<Consulta> consultaList = consultaRepository.findAll();
        assertThat(consultaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchConsulta() throws Exception {
        int databaseSizeBeforeUpdate = consultaRepository.findAll().size();
        consulta.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsultaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(consulta))
            )
            .andExpect(status().isBadRequest());

        // Validate the Consulta in the database
        List<Consulta> consultaList = consultaRepository.findAll();
        assertThat(consultaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamConsulta() throws Exception {
        int databaseSizeBeforeUpdate = consultaRepository.findAll().size();
        consulta.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsultaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(consulta)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Consulta in the database
        List<Consulta> consultaList = consultaRepository.findAll();
        assertThat(consultaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateConsultaWithPatch() throws Exception {
        // Initialize the database
        consultaRepository.saveAndFlush(consulta);

        int databaseSizeBeforeUpdate = consultaRepository.findAll().size();

        // Update the consulta using partial update
        Consulta partialUpdatedConsulta = new Consulta();
        partialUpdatedConsulta.setId(consulta.getId());

        partialUpdatedConsulta.especialidade(UPDATED_ESPECIALIDADE).valor(UPDATED_VALOR);

        restConsultaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConsulta.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConsulta))
            )
            .andExpect(status().isOk());

        // Validate the Consulta in the database
        List<Consulta> consultaList = consultaRepository.findAll();
        assertThat(consultaList).hasSize(databaseSizeBeforeUpdate);
        Consulta testConsulta = consultaList.get(consultaList.size() - 1);
        assertThat(testConsulta.getEspecialidade()).isEqualTo(UPDATED_ESPECIALIDADE);
        assertThat(testConsulta.getMedico()).isEqualTo(DEFAULT_MEDICO);
        assertThat(testConsulta.getValor()).isEqualTo(UPDATED_VALOR);
        assertThat(testConsulta.getReceita()).isEqualTo(DEFAULT_RECEITA);
        assertThat(testConsulta.getReceitaContentType()).isEqualTo(DEFAULT_RECEITA_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateConsultaWithPatch() throws Exception {
        // Initialize the database
        consultaRepository.saveAndFlush(consulta);

        int databaseSizeBeforeUpdate = consultaRepository.findAll().size();

        // Update the consulta using partial update
        Consulta partialUpdatedConsulta = new Consulta();
        partialUpdatedConsulta.setId(consulta.getId());

        partialUpdatedConsulta
            .especialidade(UPDATED_ESPECIALIDADE)
            .medico(UPDATED_MEDICO)
            .valor(UPDATED_VALOR)
            .receita(UPDATED_RECEITA)
            .receitaContentType(UPDATED_RECEITA_CONTENT_TYPE);

        restConsultaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConsulta.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedConsulta))
            )
            .andExpect(status().isOk());

        // Validate the Consulta in the database
        List<Consulta> consultaList = consultaRepository.findAll();
        assertThat(consultaList).hasSize(databaseSizeBeforeUpdate);
        Consulta testConsulta = consultaList.get(consultaList.size() - 1);
        assertThat(testConsulta.getEspecialidade()).isEqualTo(UPDATED_ESPECIALIDADE);
        assertThat(testConsulta.getMedico()).isEqualTo(UPDATED_MEDICO);
        assertThat(testConsulta.getValor()).isEqualTo(UPDATED_VALOR);
        assertThat(testConsulta.getReceita()).isEqualTo(UPDATED_RECEITA);
        assertThat(testConsulta.getReceitaContentType()).isEqualTo(UPDATED_RECEITA_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingConsulta() throws Exception {
        int databaseSizeBeforeUpdate = consultaRepository.findAll().size();
        consulta.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConsultaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, consulta.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(consulta))
            )
            .andExpect(status().isBadRequest());

        // Validate the Consulta in the database
        List<Consulta> consultaList = consultaRepository.findAll();
        assertThat(consultaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchConsulta() throws Exception {
        int databaseSizeBeforeUpdate = consultaRepository.findAll().size();
        consulta.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsultaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(consulta))
            )
            .andExpect(status().isBadRequest());

        // Validate the Consulta in the database
        List<Consulta> consultaList = consultaRepository.findAll();
        assertThat(consultaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamConsulta() throws Exception {
        int databaseSizeBeforeUpdate = consultaRepository.findAll().size();
        consulta.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConsultaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(consulta)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Consulta in the database
        List<Consulta> consultaList = consultaRepository.findAll();
        assertThat(consultaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteConsulta() throws Exception {
        // Initialize the database
        consultaRepository.saveAndFlush(consulta);

        int databaseSizeBeforeDelete = consultaRepository.findAll().size();

        // Delete the consulta
        restConsultaMockMvc
            .perform(delete(ENTITY_API_URL_ID, consulta.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Consulta> consultaList = consultaRepository.findAll();
        assertThat(consultaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
