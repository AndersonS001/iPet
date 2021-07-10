jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ConvenioService } from '../service/convenio.service';
import { IConvenio, Convenio } from '../convenio.model';
import { IConsulta } from 'app/entities/consulta/consulta.model';
import { ConsultaService } from 'app/entities/consulta/service/consulta.service';

import { ConvenioUpdateComponent } from './convenio-update.component';

describe('Component Tests', () => {
  describe('Convenio Management Update Component', () => {
    let comp: ConvenioUpdateComponent;
    let fixture: ComponentFixture<ConvenioUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let convenioService: ConvenioService;
    let consultaService: ConsultaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ConvenioUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ConvenioUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ConvenioUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      convenioService = TestBed.inject(ConvenioService);
      consultaService = TestBed.inject(ConsultaService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Consulta query and add missing value', () => {
        const convenio: IConvenio = { id: 456 };
        const consultas: IConsulta[] = [{ id: 66546 }];
        convenio.consultas = consultas;

        const consultaCollection: IConsulta[] = [{ id: 69150 }];
        spyOn(consultaService, 'query').and.returnValue(of(new HttpResponse({ body: consultaCollection })));
        const additionalConsultas = [...consultas];
        const expectedCollection: IConsulta[] = [...additionalConsultas, ...consultaCollection];
        spyOn(consultaService, 'addConsultaToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ convenio });
        comp.ngOnInit();

        expect(consultaService.query).toHaveBeenCalled();
        expect(consultaService.addConsultaToCollectionIfMissing).toHaveBeenCalledWith(consultaCollection, ...additionalConsultas);
        expect(comp.consultasSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const convenio: IConvenio = { id: 456 };
        const consultas: IConsulta = { id: 10248 };
        convenio.consultas = [consultas];

        activatedRoute.data = of({ convenio });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(convenio));
        expect(comp.consultasSharedCollection).toContain(consultas);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const convenio = { id: 123 };
        spyOn(convenioService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ convenio });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: convenio }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(convenioService.update).toHaveBeenCalledWith(convenio);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const convenio = new Convenio();
        spyOn(convenioService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ convenio });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: convenio }));
        saveSubject.complete();

        // THEN
        expect(convenioService.create).toHaveBeenCalledWith(convenio);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const convenio = { id: 123 };
        spyOn(convenioService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ convenio });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(convenioService.update).toHaveBeenCalledWith(convenio);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackConsultaById', () => {
        it('Should return tracked Consulta primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackConsultaById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
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
