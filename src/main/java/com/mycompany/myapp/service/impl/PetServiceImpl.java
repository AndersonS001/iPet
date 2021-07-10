package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Pet;
import com.mycompany.myapp.repository.PetRepository;
import com.mycompany.myapp.service.PetService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Pet}.
 */
@Service
@Transactional
public class PetServiceImpl implements PetService {

    private final Logger log = LoggerFactory.getLogger(PetServiceImpl.class);

    private final PetRepository petRepository;

    public PetServiceImpl(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    @Override
    public Pet save(Pet pet) {
        log.debug("Request to save Pet : {}", pet);
        return petRepository.save(pet);
    }

    @Override
    public Optional<Pet> partialUpdate(Pet pet) {
        log.debug("Request to partially update Pet : {}", pet);

        return petRepository
            .findById(pet.getId())
            .map(
                existingPet -> {
                    if (pet.getNome() != null) {
                        existingPet.setNome(pet.getNome());
                    }
                    if (pet.getDataNascimento() != null) {
                        existingPet.setDataNascimento(pet.getDataNascimento());
                    }
                    if (pet.getEspecie() != null) {
                        existingPet.setEspecie(pet.getEspecie());
                    }
                    if (pet.getPeso() != null) {
                        existingPet.setPeso(pet.getPeso());
                    }
                    if (pet.getFoto() != null) {
                        existingPet.setFoto(pet.getFoto());
                    }
                    if (pet.getFotoContentType() != null) {
                        existingPet.setFotoContentType(pet.getFotoContentType());
                    }

                    return existingPet;
                }
            )
            .map(petRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Pet> findAll(Pageable pageable) {
        log.debug("Request to get all Pets");
        return petRepository.findAll(pageable);
    }

    public Page<Pet> findAllWithEagerRelationships(Pageable pageable) {
        return petRepository.findAllWithEagerRelationships(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Pet> findOne(Long id) {
        log.debug("Request to get Pet : {}", id);
        return petRepository.findOneWithEagerRelationships(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Pet : {}", id);
        petRepository.deleteById(id);
    }
}
