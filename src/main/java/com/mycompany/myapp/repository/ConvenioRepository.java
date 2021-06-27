package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Convenio;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Convenio entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ConvenioRepository extends JpaRepository<Convenio, Long> {}
