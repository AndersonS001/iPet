jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TutorService } from '../service/tutor.service';
import { ITutor, Tutor } from '../tutor.model';
import { IPet } from 'app/entities/pet/pet.model';
import { PetService } from 'app/entities/pet/service/pet.service';

import { TutorUpdateComponent } from './tutor-update.component';

describe('Component Tests', () => {
  describe('Tutor Management Update Component', () => {
    let comp: TutorUpdateComponent;
    let fixture: ComponentFixture<TutorUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let tutorService: TutorService;
    let petService: PetService;

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
      petService = TestBed.inject(PetService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Pet query and add missing value', () => {
        const tutor: ITutor = { id: 456 };
        const pet: IPet = { id: 46920 };
        tutor.pet = pet;

        const petCollection: IPet[] = [{ id: 98468 }];
        spyOn(petService, 'query').and.returnValue(of(new HttpResponse({ body: petCollection })));
        const additionalPets = [pet];
        const expectedCollection: IPet[] = [...additionalPets, ...petCollection];
        spyOn(petService, 'addPetToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ tutor });
        comp.ngOnInit();

        expect(petService.query).toHaveBeenCalled();
        expect(petService.addPetToCollectionIfMissing).toHaveBeenCalledWith(petCollection, ...additionalPets);
        expect(comp.petsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const tutor: ITutor = { id: 456 };
        const pet: IPet = { id: 34311 };
        tutor.pet = pet;

        activatedRoute.data = of({ tutor });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(tutor));
        expect(comp.petsSharedCollection).toContain(pet);
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

    describe('Tracking relationships identifiers', () => {
      describe('trackPetById', () => {
        it('Should return tracked Pet primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPetById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
