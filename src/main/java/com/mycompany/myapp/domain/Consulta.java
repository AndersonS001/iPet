package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Consulta.
 */
@Entity
@Table(name = "consulta")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Consulta implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "especialidade")
    private String especialidade;

    @Column(name = "medico")
    private String medico;

    @Column(name = "valor")
    private Double valor;

    @Lob
    @Column(name = "receita")
    private byte[] receita;

    @Column(name = "receita_content_type")
    private String receitaContentType;

    @OneToMany(mappedBy = "consulta")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "consulta" }, allowSetters = true)
    private Set<Exame> exames = new HashSet<>();

    @OneToMany(mappedBy = "consulta")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "consulta" }, allowSetters = true)
    private Set<Remedios> remedios = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Consulta id(Long id) {
        this.id = id;
        return this;
    }

    public String getEspecialidade() {
        return this.especialidade;
    }

    public Consulta especialidade(String especialidade) {
        this.especialidade = especialidade;
        return this;
    }

    public void setEspecialidade(String especialidade) {
        this.especialidade = especialidade;
    }

    public String getMedico() {
        return this.medico;
    }

    public Consulta medico(String medico) {
        this.medico = medico;
        return this;
    }

    public void setMedico(String medico) {
        this.medico = medico;
    }

    public Double getValor() {
        return this.valor;
    }

    public Consulta valor(Double valor) {
        this.valor = valor;
        return this;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public byte[] getReceita() {
        return this.receita;
    }

    public Consulta receita(byte[] receita) {
        this.receita = receita;
        return this;
    }

    public void setReceita(byte[] receita) {
        this.receita = receita;
    }

    public String getReceitaContentType() {
        return this.receitaContentType;
    }

    public Consulta receitaContentType(String receitaContentType) {
        this.receitaContentType = receitaContentType;
        return this;
    }

    public void setReceitaContentType(String receitaContentType) {
        this.receitaContentType = receitaContentType;
    }

    public Set<Exame> getExames() {
        return this.exames;
    }

    public Consulta exames(Set<Exame> exames) {
        this.setExames(exames);
        return this;
    }

    public Consulta addExame(Exame exame) {
        this.exames.add(exame);
        exame.setConsulta(this);
        return this;
    }

    public Consulta removeExame(Exame exame) {
        this.exames.remove(exame);
        exame.setConsulta(null);
        return this;
    }

    public void setExames(Set<Exame> exames) {
        if (this.exames != null) {
            this.exames.forEach(i -> i.setConsulta(null));
        }
        if (exames != null) {
            exames.forEach(i -> i.setConsulta(this));
        }
        this.exames = exames;
    }

    public Set<Remedios> getRemedios() {
        return this.remedios;
    }

    public Consulta remedios(Set<Remedios> remedios) {
        this.setRemedios(remedios);
        return this;
    }

    public Consulta addRemedios(Remedios remedios) {
        this.remedios.add(remedios);
        remedios.setConsulta(this);
        return this;
    }

    public Consulta removeRemedios(Remedios remedios) {
        this.remedios.remove(remedios);
        remedios.setConsulta(null);
        return this;
    }

    public void setRemedios(Set<Remedios> remedios) {
        if (this.remedios != null) {
            this.remedios.forEach(i -> i.setConsulta(null));
        }
        if (remedios != null) {
            remedios.forEach(i -> i.setConsulta(this));
        }
        this.remedios = remedios;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Consulta)) {
            return false;
        }
        return id != null && id.equals(((Consulta) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Consulta{" +
            "id=" + getId() +
            ", especialidade='" + getEspecialidade() + "'" +
            ", medico='" + getMedico() + "'" +
            ", valor=" + getValor() +
            ", receita='" + getReceita() + "'" +
            ", receitaContentType='" + getReceitaContentType() + "'" +
            "}";
    }
}
