jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PetService } from '../service/pet.service';
import { IPet, Pet } from '../pet.model';
import { IConvenio } from 'app/entities/convenio/convenio.model';
import { ConvenioService } from 'app/entities/convenio/service/convenio.service';
import { IVacina } from 'app/entities/vacina/vacina.model';
import { VacinaService } from 'app/entities/vacina/service/vacina.service';
import { IConsulta } from 'app/entities/consulta/consulta.model';
import { ConsultaService } from 'app/entities/consulta/service/consulta.service';
import { ITutor } from 'app/entities/tutor/tutor.model';
import { TutorService } from 'app/entities/tutor/service/tutor.service';

import { PetUpdateComponent } from './pet-update.component';

describe('Component Tests', () => {
  describe('Pet Management Update Component', () => {
    let comp: PetUpdateComponent;
    let fixture: ComponentFixture<PetUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let petService: PetService;
    let convenioService: ConvenioService;
    let vacinaService: VacinaService;
    let consultaService: ConsultaService;
    let tutorService: TutorService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PetUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PetUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PetUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      petService = TestBed.inject(PetService);
      convenioService = TestBed.inject(ConvenioService);
      vacinaService = TestBed.inject(VacinaService);
      consultaService = TestBed.inject(ConsultaService);
      tutorService = TestBed.inject(TutorService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Convenio query and add missing value', () => {
        const pet: IPet = { id: 456 };
        const convenios: IConvenio[] = [{ id: 18479 }];
        pet.convenios = convenios;

        const convenioCollection: IConvenio[] = [{ id: 66351 }];
        spyOn(convenioService, 'query').and.returnValue(of(new HttpResponse({ body: convenioCollection })));
        const additionalConvenios = [...convenios];
        const expectedCollection: IConvenio[] = [...additionalConvenios, ...convenioCollection];
        spyOn(convenioService, 'addConvenioToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ pet });
        comp.ngOnInit();

        expect(convenioService.query).toHaveBeenCalled();
        expect(convenioService.addConvenioToCollectionIfMissing).toHaveBeenCalledWith(convenioCollection, ...additionalConvenios);
        expect(comp.conveniosSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Vacina query and add missing value', () => {
        const pet: IPet = { id: 456 };
        const vacinas: IVacina[] = [{ id: 84315 }];
        pet.vacinas = vacinas;

        const vacinaCollection: IVacina[] = [{ id: 60952 }];
        spyOn(vacinaService, 'query').and.returnValue(of(new HttpResponse({ body: vacinaCollection })));
        const additionalVacinas = [...vacinas];
        const expectedCollection: IVacina[] = [...additionalVacinas, ...vacinaCollection];
        spyOn(vacinaService, 'addVacinaToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ pet });
        comp.ngOnInit();

        expect(vacinaService.query).toHaveBeenCalled();
        expect(vacinaService.addVacinaToCollectionIfMissing).toHaveBeenCalledWith(vacinaCollection, ...additionalVacinas);
        expect(comp.vacinasSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Consulta query and add missing value', () => {
        const pet: IPet = { id: 456 };
        const consultas: IConsulta[] = [{ id: 2783 }];
        pet.consultas = consultas;

        const consultaCollection: IConsulta[] = [{ id: 38877 }];
        spyOn(consultaService, 'query').and.returnValue(of(new HttpResponse({ body: consultaCollection })));
        const additionalConsultas = [...consultas];
        const expectedCollection: IConsulta[] = [...additionalConsultas, ...consultaCollection];
        spyOn(consultaService, 'addConsultaToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ pet });
        comp.ngOnInit();

        expect(consultaService.query).toHaveBeenCalled();
        expect(consultaService.addConsultaToCollectionIfMissing).toHaveBeenCalledWith(consultaCollection, ...additionalConsultas);
        expect(comp.consultasSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Tutor query and add missing value', () => {
        const pet: IPet = { id: 456 };
        const tutor: ITutor = { id: 54898 };
        pet.tutor = tutor;

        const tutorCollection: ITutor[] = [{ id: 74907 }];
        spyOn(tutorService, 'query').and.returnValue(of(new HttpResponse({ body: tutorCollection })));
        const additionalTutors = [tutor];
        const expectedCollection: ITutor[] = [...additionalTutors, ...tutorCollection];
        spyOn(tutorService, 'addTutorToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ pet });
        comp.ngOnInit();

        expect(tutorService.query).toHaveBeenCalled();
        expect(tutorService.addTutorToCollectionIfMissing).toHaveBeenCalledWith(tutorCollection, ...additionalTutors);
        expect(comp.tutorsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const pet: IPet = { id: 456 };
        const convenios: IConvenio = { id: 4448 };
        pet.convenios = [convenios];
        const vacinas: IVacina = { id: 23450 };
        pet.vacinas = [vacinas];
        const consultas: IConsulta = { id: 23563 };
        pet.consultas = [consultas];
        const tutor: ITutor = { id: 25909 };
        pet.tutor = tutor;

        activatedRoute.data = of({ pet });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(pet));
        expect(comp.conveniosSharedCollection).toContain(convenios);
        expect(comp.vacinasSharedCollection).toContain(vacinas);
        expect(comp.consultasSharedCollection).toContain(consultas);
        expect(comp.tutorsSharedCollection).toContain(tutor);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const pet = { id: 123 };
        spyOn(petService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ pet });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: pet }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(petService.update).toHaveBeenCalledWith(pet);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const pet = new Pet();
        spyOn(petService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ pet });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: pet }));
        saveSubject.complete();

        // THEN
        expect(petService.create).toHaveBeenCalledWith(pet);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const pet = { id: 123 };
        spyOn(petService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ pet });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(petService.update).toHaveBeenCalledWith(pet);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackConvenioById', () => {
        it('Should return tracked Convenio primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackConvenioById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackVacinaById', () => {
        it('Should return tracked Vacina primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackVacinaById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackConsultaById', () => {
        it('Should return tracked Consulta primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackConsultaById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackTutorById', () => {
        it('Should return tracked Tutor primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackTutorById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedConvenio', () => {
        it('Should return option if no Convenio is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedConvenio(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Convenio for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedConvenio(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Convenio is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedConvenio(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });

      describe('getSelectedVacina', () => {
        it('Should return option if no Vacina is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedVacina(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Vacina for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedVacina(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Vacina is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedVacina(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });

      describe('getSelectedConsulta', () => {
        it('Should return option if no Consulta is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedConsulta(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Consulta for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedConsulta(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Consulta is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedConsulta(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
