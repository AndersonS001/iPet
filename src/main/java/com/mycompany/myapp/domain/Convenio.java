package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
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

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JoinTable(
        name = "rel_convenio__consulta",
        joinColumns = @JoinColumn(name = "convenio_id"),
        inverseJoinColumns = @JoinColumn(name = "consulta_id")
    )
    @JsonIgnoreProperties(value = { "remedios", "exames", "convenios", "pets" }, allowSetters = true)
    private Set<Consulta> consultas = new HashSet<>();

    @ManyToMany(mappedBy = "convenios")
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

    public Set<Consulta> getConsultas() {
        return this.consultas;
    }

    public Convenio consultas(Set<Consulta> consultas) {
        this.setConsultas(consultas);
        return this;
    }

    public Convenio addConsulta(Consulta consulta) {
        this.consultas.add(consulta);
        consulta.getConvenios().add(this);
        return this;
    }

    public Convenio removeConsulta(Consulta consulta) {
        this.consultas.remove(consulta);
        consulta.getConvenios().remove(this);
        return this;
    }

    public void setConsultas(Set<Consulta> consultas) {
        this.consultas = consultas;
    }

    public Set<Pet> getPets() {
        return this.pets;
    }

    public Convenio pets(Set<Pet> pets) {
        this.setPets(pets);
        return this;
    }

    public Convenio addPet(Pet pet) {
        this.pets.add(pet);
        pet.getConvenios().add(this);
        return this;
    }

    public Convenio removePet(Pet pet) {
        this.pets.remove(pet);
        pet.getConvenios().remove(this);
        return this;
    }

    public void setPets(Set<Pet> pets) {
        if (this.pets != null) {
            this.pets.forEach(i -> i.removeConvenio(this));
        }
        if (pets != null) {
            pets.forEach(i -> i.addConvenio(this));
        }
        this.pets = pets;
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
