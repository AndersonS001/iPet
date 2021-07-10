import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPet, Pet } from '../pet.model';
import { PetService } from '../service/pet.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IConvenio } from 'app/entities/convenio/convenio.model';
import { ConvenioService } from 'app/entities/convenio/service/convenio.service';
import { IVacina } from 'app/entities/vacina/vacina.model';
import { VacinaService } from 'app/entities/vacina/service/vacina.service';
import { IConsulta } from 'app/entities/consulta/consulta.model';
import { ConsultaService } from 'app/entities/consulta/service/consulta.service';
import { ITutor } from 'app/entities/tutor/tutor.model';
import { TutorService } from 'app/entities/tutor/service/tutor.service';

@Component({
  selector: 'jhi-pet-update',
  templateUrl: './pet-update.component.html',
})
export class PetUpdateComponent implements OnInit {
  isSaving = false;

  conveniosSharedCollection: IConvenio[] = [];
  vacinasSharedCollection: IVacina[] = [];
  consultasSharedCollection: IConsulta[] = [];
  tutorsSharedCollection: ITutor[] = [];

  editForm = this.fb.group({
    id: [],
    nome: [],
    dataNascimento: [],
    especie: [],
    peso: [],
    foto: [],
    fotoContentType: [],
    convenios: [],
    vacinas: [],
    consultas: [],
    tutor: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected petService: PetService,
    protected convenioService: ConvenioService,
    protected vacinaService: VacinaService,
    protected consultaService: ConsultaService,
    protected tutorService: TutorService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pet }) => {
      this.updateForm(pet);

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(
          new EventWithContent<AlertError>('iPetApp.error', { ...err, key: 'error.file.' + err.key })
        ),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pet = this.createFromForm();
    if (pet.id !== undefined) {
      this.subscribeToSaveResponse(this.petService.update(pet));
    } else {
      this.subscribeToSaveResponse(this.petService.create(pet));
    }
  }

  trackConvenioById(index: number, item: IConvenio): number {
    return item.id!;
  }

  trackVacinaById(index: number, item: IVacina): number {
    return item.id!;
  }

  trackConsultaById(index: number, item: IConsulta): number {
    return item.id!;
  }

  trackTutorById(index: number, item: ITutor): number {
    return item.id!;
  }

  getSelectedConvenio(option: IConvenio, selectedVals?: IConvenio[]): IConvenio {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  getSelectedVacina(option: IVacina, selectedVals?: IVacina[]): IVacina {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  getSelectedConsulta(option: IConsulta, selectedVals?: IConsulta[]): IConsulta {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPet>>): void {
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

  protected updateForm(pet: IPet): void {
    this.editForm.patchValue({
      id: pet.id,
      nome: pet.nome,
      dataNascimento: pet.dataNascimento,
      especie: pet.especie,
      peso: pet.peso,
      foto: pet.foto,
      fotoContentType: pet.fotoContentType,
      convenios: pet.convenios,
      vacinas: pet.vacinas,
      consultas: pet.consultas,
      tutor: pet.tutor,
    });

    this.conveniosSharedCollection = this.convenioService.addConvenioToCollectionIfMissing(
      this.conveniosSharedCollection,
      ...(pet.convenios ?? [])
    );
    this.vacinasSharedCollection = this.vacinaService.addVacinaToCollectionIfMissing(this.vacinasSharedCollection, ...(pet.vacinas ?? []));
    this.consultasSharedCollection = this.consultaService.addConsultaToCollectionIfMissing(
      this.consultasSharedCollection,
      ...(pet.consultas ?? [])
    );
    this.tutorsSharedCollection = this.tutorService.addTutorToCollectionIfMissing(this.tutorsSharedCollection, pet.tutor);
  }

  protected loadRelationshipsOptions(): void {
    this.convenioService
      .query()
      .pipe(map((res: HttpResponse<IConvenio[]>) => res.body ?? []))
      .pipe(
        map((convenios: IConvenio[]) =>
          this.convenioService.addConvenioToCollectionIfMissing(convenios, ...(this.editForm.get('convenios')!.value ?? []))
        )
      )
      .subscribe((convenios: IConvenio[]) => (this.conveniosSharedCollection = convenios));

    this.vacinaService
      .query()
      .pipe(map((res: HttpResponse<IVacina[]>) => res.body ?? []))
      .pipe(
        map((vacinas: IVacina[]) =>
          this.vacinaService.addVacinaToCollectionIfMissing(vacinas, ...(this.editForm.get('vacinas')!.value ?? []))
        )
      )
      .subscribe((vacinas: IVacina[]) => (this.vacinasSharedCollection = vacinas));

    this.consultaService
      .query()
      .pipe(map((res: HttpResponse<IConsulta[]>) => res.body ?? []))
      .pipe(
        map((consultas: IConsulta[]) =>
          this.consultaService.addConsultaToCollectionIfMissing(consultas, ...(this.editForm.get('consultas')!.value ?? []))
        )
      )
      .subscribe((consultas: IConsulta[]) => (this.consultasSharedCollection = consultas));

    this.tutorService
      .query()
      .pipe(map((res: HttpResponse<ITutor[]>) => res.body ?? []))
      .pipe(map((tutors: ITutor[]) => this.tutorService.addTutorToCollectionIfMissing(tutors, this.editForm.get('tutor')!.value)))
      .subscribe((tutors: ITutor[]) => (this.tutorsSharedCollection = tutors));
  }

  protected createFromForm(): IPet {
    return {
      ...new Pet(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      dataNascimento: this.editForm.get(['dataNascimento'])!.value,
      especie: this.editForm.get(['especie'])!.value,
      peso: this.editForm.get(['peso'])!.value,
      fotoContentType: this.editForm.get(['fotoContentType'])!.value,
      foto: this.editForm.get(['foto'])!.value,
      convenios: this.editForm.get(['convenios'])!.value,
      vacinas: this.editForm.get(['vacinas'])!.value,
      consultas: this.editForm.get(['consultas'])!.value,
      tutor: this.editForm.get(['tutor'])!.value,
    };
  }
}
