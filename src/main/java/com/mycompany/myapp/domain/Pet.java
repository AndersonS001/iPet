package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.Especie;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Pet.
 */
@Entity
@Table(name = "pet")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Pet implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Enumerated(EnumType.STRING)
    @Column(name = "especie")
    private Especie especie;

    @Column(name = "peso")
    private Double peso;

    @Lob
    @Column(name = "foto")
    private byte[] foto;

    @Column(name = "foto_content_type")
    private String fotoContentType;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JoinTable(
        name = "rel_pet__convenio",
        joinColumns = @JoinColumn(name = "pet_id"),
        inverseJoinColumns = @JoinColumn(name = "convenio_id")
    )
    @JsonIgnoreProperties(value = { "consultas", "pets" }, allowSetters = true)
    private Set<Convenio> convenios = new HashSet<>();

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JoinTable(name = "rel_pet__vacina", joinColumns = @JoinColumn(name = "pet_id"), inverseJoinColumns = @JoinColumn(name = "vacina_id"))
    @JsonIgnoreProperties(value = { "pets" }, allowSetters = true)
    private Set<Vacina> vacinas = new HashSet<>();

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JoinTable(
        name = "rel_pet__consulta",
        joinColumns = @JoinColumn(name = "pet_id"),
        inverseJoinColumns = @JoinColumn(name = "consulta_id")
    )
    @JsonIgnoreProperties(value = { "remedios", "exames", "convenios", "pets" }, allowSetters = true)
    private Set<Consulta> consultas = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "pets" }, allowSetters = true)
    private Tutor tutor;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Pet id(Long id) {
        this.id = id;
        return this;
    }

    public String getNome() {
        return this.nome;
    }

    public Pet nome(String nome) {
        this.nome = nome;
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public LocalDate getDataNascimento() {
        return this.dataNascimento;
    }

    public Pet dataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
        return this;
    }

    public void setDataNascimento(LocalDate dataNascimento) {
        this.dataNascimento = dataNascimento;
    }

    public Especie getEspecie() {
        return this.especie;
    }

    public Pet especie(Especie especie) {
        this.especie = especie;
        return this;
    }

    public void setEspecie(Especie especie) {
        this.especie = especie;
    }

    public Double getPeso() {
        return this.peso;
    }

    public Pet peso(Double peso) {
        this.peso = peso;
        return this;
    }

    public void setPeso(Double peso) {
        this.peso = peso;
    }

    public byte[] getFoto() {
        return this.foto;
    }

    public Pet foto(byte[] foto) {
        this.foto = foto;
        return this;
    }

    public void setFoto(byte[] foto) {
        this.foto = foto;
    }

    public String getFotoContentType() {
        return this.fotoContentType;
    }

    public Pet fotoContentType(String fotoContentType) {
        this.fotoContentType = fotoContentType;
        return this;
    }

    public void setFotoContentType(String fotoContentType) {
        this.fotoContentType = fotoContentType;
    }

    public Set<Convenio> getConvenios() {
        return this.convenios;
    }

    public Pet convenios(Set<Convenio> convenios) {
        this.setConvenios(convenios);
        return this;
    }

    public Pet addConvenio(Convenio convenio) {
        this.convenios.add(convenio);
        convenio.getPets().add(this);
        return this;
    }

    public Pet removeConvenio(Convenio convenio) {
        this.convenios.remove(convenio);
        convenio.getPets().remove(this);
        return this;
    }

    public void setConvenios(Set<Convenio> convenios) {
        this.convenios = convenios;
    }

    public Set<Vacina> getVacinas() {
        return this.vacinas;
    }

    public Pet vacinas(Set<Vacina> vacinas) {
        this.setVacinas(vacinas);
        return this;
    }

    public Pet addVacina(Vacina vacina) {
        this.vacinas.add(vacina);
        vacina.getPets().add(this);
        return this;
    }

    public Pet removeVacina(Vacina vacina) {
        this.vacinas.remove(vacina);
        vacina.getPets().remove(this);
        return this;
    }

    public void setVacinas(Set<Vacina> vacinas) {
        this.vacinas = vacinas;
    }

    public Set<Consulta> getConsultas() {
        return this.consultas;
    }

    public Pet consultas(Set<Consulta> consultas) {
        this.setConsultas(consultas);
        return this;
    }

    public Pet addConsulta(Consulta consulta) {
        this.consultas.add(consulta);
        consulta.getPets().add(this);
        return this;
    }

    public Pet removeConsulta(Consulta consulta) {
        this.consultas.remove(consulta);
        consulta.getPets().remove(this);
        return this;
    }

    public void setConsultas(Set<Consulta> consultas) {
        this.consultas = consultas;
    }

    public Tutor getTutor() {
        return this.tutor;
    }

    public Pet tutor(Tutor tutor) {
        this.setTutor(tutor);
        return this;
    }

    public void setTutor(Tutor tutor) {
        this.tutor = tutor;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Pet)) {
            return false;
        }
        return id != null && id.equals(((Pet) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Pet{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", dataNascimento='" + getDataNascimento() + "'" +
            ", especie='" + getEspecie() + "'" +
            ", peso=" + getPeso() +
            ", foto='" + getFoto() + "'" +
            ", fotoContentType='" + getFotoContentType() + "'" +
            "}";
    }
}
