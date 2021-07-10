package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.TipoRemedio;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Remedios.
 */
@Entity
@Table(name = "remedios")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Remedios implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "fabricante")
    private String fabricante;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo")
    private TipoRemedio tipo;

    @ManyToMany(mappedBy = "remedios")
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

    public Remedios id(Long id) {
        this.id = id;
        return this;
    }

    public String getNome() {
        return this.nome;
    }

    public Remedios nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getFabricante() {
        return this.fabricante;
    }

    public Remedios fabricante(String fabricante) {
        this.fabricante = fabricante;
        return this;
    }

    public void setFabricante(String fabricante) {
        this.fabricante = fabricante;
    }

    public TipoRemedio getTipo() {
        return this.tipo;
    }

    public Remedios tipo(TipoRemedio tipo) {
        this.tipo = tipo;
        return this;
    }

    public void setTipo(TipoRemedio tipo) {
        this.tipo = tipo;
    }

    public Set<Consulta> getConsultas() {
        return this.consultas;
    }

    public Remedios consultas(Set<Consulta> consultas) {
        this.setConsultas(consultas);
        return this;
    }

    public Remedios addConsulta(Consulta consulta) {
        this.consultas.add(consulta);
        consulta.getRemedios().add(this);
        return this;
    }

    public Remedios removeConsulta(Consulta consulta) {
        this.consultas.remove(consulta);
        consulta.getRemedios().remove(this);
        return this;
    }

    public void setConsultas(Set<Consulta> consultas) {
        if (this.consultas != null) {
            this.consultas.forEach(i -> i.removeRemedios(this));
        }
        if (consultas != null) {
            consultas.forEach(i -> i.addRemedios(this));
        }
        this.consultas = consultas;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Remedios)) {
            return false;
        }
        return id != null && id.equals(((Remedios) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Remedios{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", fabricante='" + getFabricante() + "'" +
            ", tipo='" + getTipo() + "'" +
            "}";
    }
}
