package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Tutor;
import com.mycompany.myapp.repository.TutorRepository;
import com.mycompany.myapp.service.TutorService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Tutor}.
 */
@Service
@Transactional
public class TutorServiceImpl implements TutorService {

    private final Logger log = LoggerFactory.getLogger(TutorServiceImpl.class);

    private final TutorRepository tutorRepository;

    public TutorServiceImpl(TutorRepository tutorRepository) {
        this.tutorRepository = tutorRepository;
    }

    @Override
    public Tutor save(Tutor tutor) {
        log.debug("Request to save Tutor : {}", tutor);
        return tutorRepository.save(tutor);
    }

    @Override
    public Optional<Tutor> partialUpdate(Tutor tutor) {
        log.debug("Request to partially update Tutor : {}", tutor);

        return tutorRepository
            .findById(tutor.getId())
            .map(
                existingTutor -> {
                    if (tutor.getNome() != null) {
                        existingTutor.setNome(tutor.getNome());
                    }
                    if (tutor.getEmail() != null) {
                        existingTutor.setEmail(tutor.getEmail());
                    }
                    if (tutor.getDataNascimento() != null) {
                        existingTutor.setDataNascimento(tutor.getDataNascimento());
                    }

                    return existingTutor;
                }
            )
            .map(tutorRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Tutor> findAll() {
        log.debug("Request to get all Tutors");
        return tutorRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Tutor> findOne(Long id) {
        log.debug("Request to get Tutor : {}", id);
        return tutorRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Tutor : {}", id);
        tutorRepository.deleteById(id);
    }
}
