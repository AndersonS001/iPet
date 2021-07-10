jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ConsultaService } from '../service/consulta.service';
import { IConsulta, Consulta } from '../consulta.model';
import { IRemedios } from 'app/entities/remedios/remedios.model';
import { RemediosService } from 'app/entities/remedios/service/remedios.service';
import { IExame } from 'app/entities/exame/exame.model';
import { ExameService } from 'app/entities/exame/service/exame.service';

import { ConsultaUpdateComponent } from './consulta-update.component';

describe('Component Tests', () => {
  describe('Consulta Management Update Component', () => {
    let comp: ConsultaUpdateComponent;
    let fixture: ComponentFixture<ConsultaUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let consultaService: ConsultaService;
    let remediosService: RemediosService;
    let exameService: ExameService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ConsultaUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ConsultaUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ConsultaUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      consultaService = TestBed.inject(ConsultaService);
      remediosService = TestBed.inject(RemediosService);
      exameService = TestBed.inject(ExameService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Remedios query and add missing value', () => {
        const consulta: IConsulta = { id: 456 };
        const remedios: IRemedios[] = [{ id: 7156 }];
        consulta.remedios = remedios;

        const remediosCollection: IRemedios[] = [{ id: 28067 }];
        spyOn(remediosService, 'query').and.returnValue(of(new HttpResponse({ body: remediosCollection })));
        const additionalRemedios = [...remedios];
        const expectedCollection: IRemedios[] = [...additionalRemedios, ...remediosCollection];
        spyOn(remediosService, 'addRemediosToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ consulta });
        comp.ngOnInit();

        expect(remediosService.query).toHaveBeenCalled();
        expect(remediosService.addRemediosToCollectionIfMissing).toHaveBeenCalledWith(remediosCollection, ...additionalRemedios);
        expect(comp.remediosSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Exame query and add missing value', () => {
        const consulta: IConsulta = { id: 456 };
        const exames: IExame[] = [{ id: 83272 }];
        consulta.exames = exames;

        const exameCollection: IExame[] = [{ id: 4321 }];
        spyOn(exameService, 'query').and.returnValue(of(new HttpResponse({ body: exameCollection })));
        const additionalExames = [...exames];
        const expectedCollection: IExame[] = [...additionalExames, ...exameCollection];
        spyOn(exameService, 'addExameToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ consulta });
        comp.ngOnInit();

        expect(exameService.query).toHaveBeenCalled();
        expect(exameService.addExameToCollectionIfMissing).toHaveBeenCalledWith(exameCollection, ...additionalExames);
        expect(comp.examesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const consulta: IConsulta = { id: 456 };
        const remedios: IRemedios = { id: 58544 };
        consulta.remedios = [remedios];
        const exames: IExame = { id: 6905 };
        consulta.exames = [exames];

        activatedRoute.data = of({ consulta });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(consulta));
        expect(comp.remediosSharedCollection).toContain(remedios);
        expect(comp.examesSharedCollection).toContain(exames);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const consulta = { id: 123 };
        spyOn(consultaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ consulta });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: consulta }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(consultaService.update).toHaveBeenCalledWith(consulta);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const consulta = new Consulta();
        spyOn(consultaService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ consulta });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: consulta }));
        saveSubject.complete();

        // THEN
        expect(consultaService.create).toHaveBeenCalledWith(consulta);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const consulta = { id: 123 };
        spyOn(consultaService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ consulta });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(consultaService.update).toHaveBeenCalledWith(consulta);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackRemediosById', () => {
        it('Should return tracked Remedios primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackRemediosById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackExameById', () => {
        it('Should return tracked Exame primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackExameById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedRemedios', () => {
        it('Should return option if no Remedios is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedRemedios(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Remedios for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedRemedios(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Remedios is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedRemedios(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });

      describe('getSelectedExame', () => {
        it('Should return option if no Exame is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedExame(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Exame for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedExame(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Exame is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedExame(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
