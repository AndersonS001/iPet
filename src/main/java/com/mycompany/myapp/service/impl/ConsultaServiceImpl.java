package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Consulta;
import com.mycompany.myapp.repository.ConsultaRepository;
import com.mycompany.myapp.service.ConsultaService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Consulta}.
 */
@Service
@Transactional
public class ConsultaServiceImpl implements ConsultaService {

    private final Logger log = LoggerFactory.getLogger(ConsultaServiceImpl.class);

    private final ConsultaRepository consultaRepository;

    public ConsultaServiceImpl(ConsultaRepository consultaRepository) {
        this.consultaRepository = consultaRepository;
    }

    @Override
    public Consulta save(Consulta consulta) {
        log.debug("Request to save Consulta : {}", consulta);
        return consultaRepository.save(consulta);
    }

    @Override
    public Optional<Consulta> partialUpdate(Consulta consulta) {
        log.debug("Request to partially update Consulta : {}", consulta);

        return consultaRepository
            .findById(consulta.getId())
            .map(
                existingConsulta -> {
                    if (consulta.getEspecialidade() != null) {
                        existingConsulta.setEspecialidade(consulta.getEspecialidade());
                    }
                    if (consulta.getMedico() != null) {
                        existingConsulta.setMedico(consulta.getMedico());
                    }
                    if (consulta.getValor() != null) {
                        existingConsulta.setValor(consulta.getValor());
                    }
                    if (consulta.getReceita() != null) {
                        existingConsulta.setReceita(consulta.getReceita());
                    }
                    if (consulta.getReceitaContentType() != null) {
                        existingConsulta.setReceitaContentType(consulta.getReceitaContentType());
                    }

                    return existingConsulta;
                }
            )
            .map(consultaRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Consulta> findAll() {
        log.debug("Request to get all Consultas");
        return consultaRepository.findAllWithEagerRelationships();
    }

    public Page<Consulta> findAllWithEagerRelationships(Pageable pageable) {
        return consultaRepository.findAllWithEagerRelationships(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Consulta> findOne(Long id) {
        log.debug("Request to get Consulta : {}", id);
        return consultaRepository.findOneWithEagerRelationships(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Consulta : {}", id);
        consultaRepository.deleteById(id);
    }
}
