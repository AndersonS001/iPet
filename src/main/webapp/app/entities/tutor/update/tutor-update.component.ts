import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITutor, Tutor } from '../tutor.model';
import { TutorService } from '../service/tutor.service';
import { IPet } from 'app/entities/pet/pet.model';
import { PetService } from 'app/entities/pet/service/pet.service';

@Component({
  selector: 'jhi-tutor-update',
  templateUrl: './tutor-update.component.html',
})
export class TutorUpdateComponent implements OnInit {
  isSaving = false;

  petsSharedCollection: IPet[] = [];

  editForm = this.fb.group({
    id: [],
    nome: [],
    email: [],
    dataNascimento: [],
    pet: [],
  });

  constructor(
    protected tutorService: TutorService,
    protected petService: PetService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tutor }) => {
      this.updateForm(tutor);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tutor = this.createFromForm();
    if (tutor.id !== undefined) {
      this.subscribeToSaveResponse(this.tutorService.update(tutor));
    } else {
      this.subscribeToSaveResponse(this.tutorService.create(tutor));
    }
  }

  trackPetById(index: number, item: IPet): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITutor>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(tutor: ITutor): void {
    this.editForm.patchValue({
      id: tutor.id,
      nome: tutor.nome,
      email: tutor.email,
      dataNascimento: tutor.dataNascimento,
      pet: tutor.pet,
    });

    this.petsSharedCollection = this.petService.addPetToCollectionIfMissing(this.petsSharedCollection, tutor.pet);
  }

  protected loadRelationshipsOptions(): void {
    this.petService
      .query()
      .pipe(map((res: HttpResponse<IPet[]>) => res.body ?? []))
      .pipe(map((pets: IPet[]) => this.petService.addPetToCollectionIfMissing(pets, this.editForm.get('pet')!.value)))
      .subscribe((pets: IPet[]) => (this.petsSharedCollection = pets));
  }

  protected createFromForm(): ITutor {
    return {
      ...new Tutor(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      email: this.editForm.get(['email'])!.value,
      dataNascimento: this.editForm.get(['dataNascimento'])!.value,
      pet: this.editForm.get(['pet'])!.value,
    };
  }
}
