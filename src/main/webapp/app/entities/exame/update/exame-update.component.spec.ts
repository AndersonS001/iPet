jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ExameService } from '../service/exame.service';
import { IExame, Exame } from '../exame.model';
import { IConsulta } from 'app/entities/consulta/consulta.model';
import { ConsultaService } from 'app/entities/consulta/service/consulta.service';

import { ExameUpdateComponent } from './exame-update.component';

describe('Component Tests', () => {
  describe('Exame Management Update Component', () => {
    let comp: ExameUpdateComponent;
    let fixture: ComponentFixture<ExameUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let exameService: ExameService;
    let consultaService: ConsultaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ExameUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ExameUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ExameUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      exameService = TestBed.inject(ExameService);
      consultaService = TestBed.inject(ConsultaService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Consulta query and add missing value', () => {
        const exame: IExame = { id: 456 };
        const consulta: IConsulta = { id: 2783 };
        exame.consulta = consulta;

        const consultaCollection: IConsulta[] = [{ id: 38877 }];
        spyOn(consultaService, 'query').and.returnValue(of(new HttpResponse({ body: consultaCollection })));
        const additionalConsultas = [consulta];
        const expectedCollection: IConsulta[] = [...additionalConsultas, ...consultaCollection];
        spyOn(consultaService, 'addConsultaToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ exame });
        comp.ngOnInit();

        expect(consultaService.query).toHaveBeenCalled();
        expect(consultaService.addConsultaToCollectionIfMissing).toHaveBeenCalledWith(consultaCollection, ...additionalConsultas);
        expect(comp.consultasSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const exame: IExame = { id: 456 };
        const consulta: IConsulta = { id: 23563 };
        exame.consulta = consulta;

        activatedRoute.data = of({ exame });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(exame));
        expect(comp.consultasSharedCollection).toContain(consulta);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const exame = { id: 123 };
        spyOn(exameService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ exame });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: exame }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(exameService.update).toHaveBeenCalledWith(exame);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const exame = new Exame();
        spyOn(exameService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ exame });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: exame }));
        saveSubject.complete();

        // THEN
        expect(exameService.create).toHaveBeenCalledWith(exame);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const exame = { id: 123 };
        spyOn(exameService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ exame });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(exameService.update).toHaveBeenCalledWith(exame);
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
  });
});
