package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Remedios;
import com.mycompany.myapp.repository.RemediosRepository;
import com.mycompany.myapp.service.RemediosService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Remedios}.
 */
@Service
@Transactional
public class RemediosServiceImpl implements RemediosService {

    private final Logger log = LoggerFactory.getLogger(RemediosServiceImpl.class);

    private final RemediosRepository remediosRepository;

    public RemediosServiceImpl(RemediosRepository remediosRepository) {
        this.remediosRepository = remediosRepository;
    }

    @Override
    public Remedios save(Remedios remedios) {
        log.debug("Request to save Remedios : {}", remedios);
        return remediosRepository.save(remedios);
    }

    @Override
    public Optional<Remedios> partialUpdate(Remedios remedios) {
        log.debug("Request to partially update Remedios : {}", remedios);

        return remediosRepository
            .findById(remedios.getId())
            .map(
                existingRemedios -> {
                    if (remedios.getNome() != null) {
                        existingRemedios.setNome(remedios.getNome());
                    }
                    if (remedios.getFabricante() != null) {
                        existingRemedios.setFabricante(remedios.getFabricante());
                    }
                    if (remedios.getTipo() != null) {
                        existingRemedios.setTipo(remedios.getTipo());
                    }

                    return existingRemedios;
                }
            )
            .map(remediosRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Remedios> findAll() {
        log.debug("Request to get all Remedios");
        return remediosRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Remedios> findOne(Long id) {
        log.debug("Request to get Remedios : {}", id);
        return remediosRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Remedios : {}", id);
        remediosRepository.deleteById(id);
    }
}
