package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Exame.
 */
@Entity
@Table(name = "exame")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Exame implements Serializable {

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
    @Column(name = "resultado")
    private byte[] resultado;

    @Column(name = "resultado_content_type")
    private String resultadoContentType;

    @ManyToMany(mappedBy = "exames")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "remedios", "exames", "convenios", "pets" }, allowSetters = true)
    private Set<Consulta> consultas = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Exame id(Long id) {
        this.id = id;
        return this;
    }

    public String getEspecialidade() {
        return this.especialidade;
    }

    public Exame especialidade(String especialidade) {
        this.especialidade = especialidade;
        return this;
    }

    public void setEspecialidade(String especialidade) {
        this.especialidade = especialidade;
    }

    public String getMedico() {
        return this.medico;
    }

    public Exame medico(String medico) {
        this.medico = medico;
        return this;
    }

    public void setMedico(String medico) {
        this.medico = medico;
    }

    public Double getValor() {
        return this.valor;
    }

    public Exame valor(Double valor) {
        this.valor = valor;
        return this;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    public byte[] getResultado() {
        return this.resultado;
    }

    public Exame resultado(byte[] resultado) {
        this.resultado = resultado;
        return this;
    }

    public void setResultado(byte[] resultado) {
        this.resultado = resultado;
    }

    public String getResultadoContentType() {
        return this.resultadoContentType;
    }

    public Exame resultadoContentType(String resultadoContentType) {
        this.resultadoContentType = resultadoContentType;
        return this;
    }

    public void setResultadoContentType(String resultadoContentType) {
        this.resultadoContentType = resultadoContentType;
    }

    public Set<Consulta> getConsultas() {
        return this.consultas;
    }

    public Exame consultas(Set<Consulta> consultas) {
        this.setConsultas(consultas);
        return this;
    }

    public Exame addConsulta(Consulta consulta) {
        this.consultas.add(consulta);
        consulta.getExames().add(this);
        return this;
    }

    public Exame removeConsulta(Consulta consulta) {
        this.consultas.remove(consulta);
        consulta.getExames().remove(this);
        return this;
    }

    public void setConsultas(Set<Consulta> consultas) {
        if (this.consultas != null) {
            this.consultas.forEach(i -> i.removeExame(this));
        }
        if (consultas != null) {
            consultas.forEach(i -> i.addExame(this));
        }
        this.consultas = consultas;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Exame)) {
            return false;
        }
        return id != null && id.equals(((Exame) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Exame{" +
            "id=" + getId() +
            ", especialidade='" + getEspecialidade() + "'" +
            ", medico='" + getMedico() + "'" +
            ", valor=" + getValor() +
            ", resultado='" + getResultado() + "'" +
            ", resultadoContentType='" + getResultadoContentType() + "'" +
            "}";
    }
}
