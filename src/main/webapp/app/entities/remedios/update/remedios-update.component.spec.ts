jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { RemediosService } from '../service/remedios.service';
import { IRemedios, Remedios } from '../remedios.model';
import { IConsulta } from 'app/entities/consulta/consulta.model';
import { ConsultaService } from 'app/entities/consulta/service/consulta.service';

import { RemediosUpdateComponent } from './remedios-update.component';

describe('Component Tests', () => {
  describe('Remedios Management Update Component', () => {
    let comp: RemediosUpdateComponent;
    let fixture: ComponentFixture<RemediosUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let remediosService: RemediosService;
    let consultaService: ConsultaService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RemediosUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(RemediosUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RemediosUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      remediosService = TestBed.inject(RemediosService);
      consultaService = TestBed.inject(ConsultaService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Consulta query and add missing value', () => {
        const remedios: IRemedios = { id: 456 };
        const consulta: IConsulta = { id: 66546 };
        remedios.consulta = consulta;

        const consultaCollection: IConsulta[] = [{ id: 69150 }];
        spyOn(consultaService, 'query').and.returnValue(of(new HttpResponse({ body: consultaCollection })));
        const additionalConsultas = [consulta];
        const expectedCollection: IConsulta[] = [...additionalConsultas, ...consultaCollection];
        spyOn(consultaService, 'addConsultaToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ remedios });
        comp.ngOnInit();

        expect(consultaService.query).toHaveBeenCalled();
        expect(consultaService.addConsultaToCollectionIfMissing).toHaveBeenCalledWith(consultaCollection, ...additionalConsultas);
        expect(comp.consultasSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const remedios: IRemedios = { id: 456 };
        const consulta: IConsulta = { id: 10248 };
        remedios.consulta = consulta;

        activatedRoute.data = of({ remedios });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(remedios));
        expect(comp.consultasSharedCollection).toContain(consulta);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const remedios = { id: 123 };
        spyOn(remediosService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ remedios });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: remedios }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(remediosService.update).toHaveBeenCalledWith(remedios);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const remedios = new Remedios();
        spyOn(remediosService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ remedios });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: remedios }));
        saveSubject.complete();

        // THEN
        expect(remediosService.create).toHaveBeenCalledWith(remedios);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const remedios = { id: 123 };
        spyOn(remediosService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ remedios });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(remediosService.update).toHaveBeenCalledWith(remedios);
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
