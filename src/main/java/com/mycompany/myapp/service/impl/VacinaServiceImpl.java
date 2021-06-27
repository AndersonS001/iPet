package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Vacina;
import com.mycompany.myapp.repository.VacinaRepository;
import com.mycompany.myapp.service.VacinaService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Vacina}.
 */
@Service
@Transactional
public class VacinaServiceImpl implements VacinaService {

    private final Logger log = LoggerFactory.getLogger(VacinaServiceImpl.class);

    private final VacinaRepository vacinaRepository;

    public VacinaServiceImpl(VacinaRepository vacinaRepository) {
        this.vacinaRepository = vacinaRepository;
    }

    @Override
    public Vacina save(Vacina vacina) {
        log.debug("Request to save Vacina : {}", vacina);
        return vacinaRepository.save(vacina);
    }

    @Override
    public Optional<Vacina> partialUpdate(Vacina vacina) {
        log.debug("Request to partially update Vacina : {}", vacina);

        return vacinaRepository
            .findById(vacina.getId())
            .map(
                existingVacina -> {
                    if (vacina.getNome() != null) {
                        existingVacina.setNome(vacina.getNome());
                    }
                    if (vacina.getDataAplicacao() != null) {
                        existingVacina.setDataAplicacao(vacina.getDataAplicacao());
                    }
                    if (vacina.getTipo() != null) {
                        existingVacina.setTipo(vacina.getTipo());
                    }

                    return existingVacina;
                }
            )
            .map(vacinaRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Vacina> findAll() {
        log.debug("Request to get all Vacinas");
        return vacinaRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Vacina> findOne(Long id) {
        log.debug("Request to get Vacina : {}", id);
        return vacinaRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Vacina : {}", id);
        vacinaRepository.deleteById(id);
    }
}
