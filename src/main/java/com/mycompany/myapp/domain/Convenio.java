package com.mycompany.myapp.domain;

import java.io.Serializable;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Convenio.
 */
@Entity
@Table(name = "convenio")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Convenio implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "plano")
    private String plano;

    @Column(name = "valor")
    private Double valor;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Convenio id(Long id) {
        this.id = id;
        return this;
    }

    public String getNome() {
        return this.nome;
    }

    public Convenio nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getPlano() {
        return this.plano;
    }

    public Convenio plano(String plano) {
        this.plano = plano;
        return this;
    }

    public void setPlano(String plano) {
        this.plano = plano;
    }

    public Double getValor() {
        return this.valor;
    }

    public Convenio valor(Double valor) {
        this.valor = valor;
        return this;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Convenio)) {
            return false;
        }
        return id != null && id.equals(((Convenio) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Convenio{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", plano='" + getPlano() + "'" +
            ", valor=" + getValor() +
            "}";
    }
}
