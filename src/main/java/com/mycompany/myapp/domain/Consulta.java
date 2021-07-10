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

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JoinTable(
        name = "rel_consulta__remedios",
        joinColumns = @JoinColumn(name = "consulta_id"),
        inverseJoinColumns = @JoinColumn(name = "remedios_id")
    )
    @JsonIgnoreProperties(value = { "consultas" }, allowSetters = true)
    private Set<Remedios> remedios = new HashSet<>();

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JoinTable(
        name = "rel_consulta__exame",
        joinColumns = @JoinColumn(name = "consulta_id"),
        inverseJoinColumns = @JoinColumn(name = "exame_id")
    )
    @JsonIgnoreProperties(value = { "consultas" }, allowSetters = true)
    private Set<Exame> exames = new HashSet<>();

    @ManyToMany(mappedBy = "consultas")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "consultas", "pets" }, allowSetters = true)
    private Set<Convenio> convenios = new HashSet<>();

    @ManyToMany(mappedBy = "consultas")
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

    public Set<Remedios> getRemedios() {
        return this.remedios;
    }

    public Consulta remedios(Set<Remedios> remedios) {
        this.setRemedios(remedios);
        return this;
    }

    public Consulta addRemedios(Remedios remedios) {
        this.remedios.add(remedios);
        remedios.getConsultas().add(this);
        return this;
    }

    public Consulta removeRemedios(Remedios remedios) {
        this.remedios.remove(remedios);
        remedios.getConsultas().remove(this);
        return this;
    }

    public void setRemedios(Set<Remedios> remedios) {
        this.remedios = remedios;
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
        exame.getConsultas().add(this);
        return this;
    }

    public Consulta removeExame(Exame exame) {
        this.exames.remove(exame);
        exame.getConsultas().remove(this);
        return this;
    }

    public void setExames(Set<Exame> exames) {
        this.exames = exames;
    }

    public Set<Convenio> getConvenios() {
        return this.convenios;
    }

    public Consulta convenios(Set<Convenio> convenios) {
        this.setConvenios(convenios);
        return this;
    }

    public Consulta addConvenio(Convenio convenio) {
        this.convenios.add(convenio);
        convenio.getConsultas().add(this);
        return this;
    }

    public Consulta removeConvenio(Convenio convenio) {
        this.convenios.remove(convenio);
        convenio.getConsultas().remove(this);
        return this;
    }

    public void setConvenios(Set<Convenio> convenios) {
        if (this.convenios != null) {
            this.convenios.forEach(i -> i.removeConsulta(this));
        }
        if (convenios != null) {
            convenios.forEach(i -> i.addConsulta(this));
        }
        this.convenios = convenios;
    }

    public Set<Pet> getPets() {
        return this.pets;
    }

    public Consulta pets(Set<Pet> pets) {
        this.setPets(pets);
        return this;
    }

    public Consulta addPet(Pet pet) {
        this.pets.add(pet);
        pet.getConsultas().add(this);
        return this;
    }

    public Consulta removePet(Pet pet) {
        this.pets.remove(pet);
        pet.getConsultas().remove(this);
        return this;
    }

    public void setPets(Set<Pet> pets) {
        if (this.pets != null) {
            this.pets.forEach(i -> i.removeConsulta(this));
        }
        if (pets != null) {
            pets.forEach(i -> i.addConsulta(this));
        }
        this.pets = pets;
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
