package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Exame;
import com.mycompany.myapp.repository.ExameRepository;
import com.mycompany.myapp.service.ExameService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Exame}.
 */
@Service
@Transactional
public class ExameServiceImpl implements ExameService {

    private final Logger log = LoggerFactory.getLogger(ExameServiceImpl.class);

    private final ExameRepository exameRepository;

    public ExameServiceImpl(ExameRepository exameRepository) {
        this.exameRepository = exameRepository;
    }

    @Override
    public Exame save(Exame exame) {
        log.debug("Request to save Exame : {}", exame);
        return exameRepository.save(exame);
    }

    @Override
    public Optional<Exame> partialUpdate(Exame exame) {
        log.debug("Request to partially update Exame : {}", exame);

        return exameRepository
            .findById(exame.getId())
            .map(
                existingExame -> {
                    if (exame.getEspecialidade() != null) {
                        existingExame.setEspecialidade(exame.getEspecialidade());
                    }
                    if (exame.getMedico() != null) {
                        existingExame.setMedico(exame.getMedico());
                    }
                    if (exame.getValor() != null) {
                        existingExame.setValor(exame.getValor());
                    }
                    if (exame.getResultado() != null) {
                        existingExame.setResultado(exame.getResultado());
                    }
                    if (exame.getResultadoContentType() != null) {
                        existingExame.setResultadoContentType(exame.getResultadoContentType());
                    }

                    return existingExame;
                }
            )
            .map(exameRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Exame> findAll() {
        log.debug("Request to get all Exames");
        return exameRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Exame> findOne(Long id) {
        log.debug("Request to get Exame : {}", id);
        return exameRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Exame : {}", id);
        exameRepository.deleteById(id);
    }
}
