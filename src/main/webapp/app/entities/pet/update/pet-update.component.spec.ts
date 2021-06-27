jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PetService } from '../service/pet.service';
import { IPet, Pet } from '../pet.model';

import { PetUpdateComponent } from './pet-update.component';

describe('Component Tests', () => {
  describe('Pet Management Update Component', () => {
    let comp: PetUpdateComponent;
    let fixture: ComponentFixture<PetUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let petService: PetService;

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

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const pet: IPet = { id: 456 };

        activatedRoute.data = of({ pet });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(pet));
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
  });
});
