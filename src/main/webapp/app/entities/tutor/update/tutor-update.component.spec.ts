jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TutorService } from '../service/tutor.service';
import { ITutor, Tutor } from '../tutor.model';

import { TutorUpdateComponent } from './tutor-update.component';

describe('Component Tests', () => {
  describe('Tutor Management Update Component', () => {
    let comp: TutorUpdateComponent;
    let fixture: ComponentFixture<TutorUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let tutorService: TutorService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TutorUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(TutorUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TutorUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      tutorService = TestBed.inject(TutorService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const tutor: ITutor = { id: 456 };

        activatedRoute.data = of({ tutor });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(tutor));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const tutor = { id: 123 };
        spyOn(tutorService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ tutor });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: tutor }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(tutorService.update).toHaveBeenCalledWith(tutor);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const tutor = new Tutor();
        spyOn(tutorService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ tutor });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: tutor }));
        saveSubject.complete();

        // THEN
        expect(tutorService.create).toHaveBeenCalledWith(tutor);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const tutor = { id: 123 };
        spyOn(tutorService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ tutor });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(tutorService.update).toHaveBeenCalledWith(tutor);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
