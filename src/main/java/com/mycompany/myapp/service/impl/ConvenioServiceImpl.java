package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Convenio;
import com.mycompany.myapp.repository.ConvenioRepository;
import com.mycompany.myapp.service.ConvenioService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Convenio}.
 */
@Service
@Transactional
public class ConvenioServiceImpl implements ConvenioService {

    private final Logger log = LoggerFactory.getLogger(ConvenioServiceImpl.class);

    private final ConvenioRepository convenioRepository;

    public ConvenioServiceImpl(ConvenioRepository convenioRepository) {
        this.convenioRepository = convenioRepository;
    }

    @Override
    public Convenio save(Convenio convenio) {
        log.debug("Request to save Convenio : {}", convenio);
        return convenioRepository.save(convenio);
    }

    @Override
    public Optional<Convenio> partialUpdate(Convenio convenio) {
        log.debug("Request to partially update Convenio : {}", convenio);

        return convenioRepository
            .findById(convenio.getId())
            .map(
                existingConvenio -> {
                    if (convenio.getNome() != null) {
                        existingConvenio.setNome(convenio.getNome());
                    }
                    if (convenio.getEmail() != null) {
                        existingConvenio.setEmail(convenio.getEmail());
                    }
                    if (convenio.getValor() != null) {
                        existingConvenio.setValor(convenio.getValor());
                    }

                    return existingConvenio;
                }
            )
            .map(convenioRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Convenio> findAll() {
        log.debug("Request to get all Convenios");
        return convenioRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Convenio> findOne(Long id) {
        log.debug("Request to get Convenio : {}", id);
        return convenioRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Convenio : {}", id);
        convenioRepository.deleteById(id);
    }
}
