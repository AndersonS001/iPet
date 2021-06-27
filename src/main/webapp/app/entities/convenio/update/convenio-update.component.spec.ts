jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ConvenioService } from '../service/convenio.service';
import { IConvenio, Convenio } from '../convenio.model';

import { ConvenioUpdateComponent } from './convenio-update.component';

describe('Component Tests', () => {
  describe('Convenio Management Update Component', () => {
    let comp: ConvenioUpdateComponent;
    let fixture: ComponentFixture<ConvenioUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let convenioService: ConvenioService;

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

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const convenio: IConvenio = { id: 456 };

        activatedRoute.data = of({ convenio });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(convenio));
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
  });
});
