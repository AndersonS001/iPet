package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.TipoVacina;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Vacina.
 */
@Entity
@Table(name = "vacina")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Vacina implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "data_aplicacao")
    private LocalDate dataAplicacao;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo")
    private TipoVacina tipo;

    @ManyToMany(mappedBy = "vacinas")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "convenios", "vacinas", "consultas", "tutor" }, allowSetters = true)
    private Set<Pet> pets = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Vacina id(Long id) {
        this.id = id;
        return this;
    }

    public String getNome() {
        return this.nome;
    }

    public Vacina nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public LocalDate getDataAplicacao() {
        return this.dataAplicacao;
    }

    public Vacina dataAplicacao(LocalDate dataAplicacao) {
        this.dataAplicacao = dataAplicacao;
        return this;
    }

    public void setDataAplicacao(LocalDate dataAplicacao) {
        this.dataAplicacao = dataAplicacao;
    }

    public TipoVacina getTipo() {
        return this.tipo;
    }

    public Vacina tipo(TipoVacina tipo) {
        this.tipo = tipo;
        return this;
    }

    public void setTipo(TipoVacina tipo) {
        this.tipo = tipo;
    }

    public Set<Pet> getPets() {
        return this.pets;
    }

    public Vacina pets(Set<Pet> pets) {
        this.setPets(pets);
        return this;
    }

    public Vacina addPet(Pet pet) {
        this.pets.add(pet);
        pet.getVacinas().add(this);
        return this;
    }

    public Vacina removePet(Pet pet) {
        this.pets.remove(pet);
        pet.getVacinas().remove(this);
        return this;
    }

    public void setPets(Set<Pet> pets) {
        if (this.pets != null) {
            this.pets.forEach(i -> i.removeVacina(this));
        }
        if (pets != null) {
            pets.forEach(i -> i.addVacina(this));
        }
        this.pets = pets;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Vacina)) {
            return false;
        }
        return id != null && id.equals(((Vacina) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Vacina{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", dataAplicacao='" + getDataAplicacao() + "'" +
            ", tipo='" + getTipo() + "'" +
            "}";
    }
}
