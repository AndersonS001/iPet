package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class RemediosTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Remedios.class);
        Remedios remedios1 = new Remedios();
        remedios1.setId(1L);
        Remedios remedios2 = new Remedios();
        remedios2.setId(remedios1.getId());
        assertThat(remedios1).isEqualTo(remedios2);
        remedios2.setId(2L);
        assertThat(remedios1).isNotEqualTo(remedios2);
        remedios1.setId(null);
        assertThat(remedios1).isNotEqualTo(remedios2);
    }
}
