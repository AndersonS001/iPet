import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IExame, Exame } from '../exame.model';
import { ExameService } from '../service/exame.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IConsulta } from 'app/entities/consulta/consulta.model';
import { ConsultaService } from 'app/entities/consulta/service/consulta.service';

@Component({
  selector: 'jhi-exame-update',
  templateUrl: './exame-update.component.html',
})
export class ExameUpdateComponent implements OnInit {
  isSaving = false;

  consultasSharedCollection: IConsulta[] = [];

  editForm = this.fb.group({
    id: [],
    especialidade: [],
    medico: [],
    valor: [],
    resultado: [],
    resultadoContentType: [],
    consulta: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected exameService: ExameService,
    protected consultaService: ConsultaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ exame }) => {
      this.updateForm(exame);

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

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const exame = this.createFromForm();
    if (exame.id !== undefined) {
      this.subscribeToSaveResponse(this.exameService.update(exame));
    } else {
      this.subscribeToSaveResponse(this.exameService.create(exame));
    }
  }

  trackConsultaById(index: number, item: IConsulta): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IExame>>): void {
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

  protected updateForm(exame: IExame): void {
    this.editForm.patchValue({
      id: exame.id,
      especialidade: exame.especialidade,
      medico: exame.medico,
      valor: exame.valor,
      resultado: exame.resultado,
      resultadoContentType: exame.resultadoContentType,
      consulta: exame.consulta,
    });

    this.consultasSharedCollection = this.consultaService.addConsultaToCollectionIfMissing(this.consultasSharedCollection, exame.consulta);
  }

  protected loadRelationshipsOptions(): void {
    this.consultaService
      .query()
      .pipe(map((res: HttpResponse<IConsulta[]>) => res.body ?? []))
      .pipe(
        map((consultas: IConsulta[]) =>
          this.consultaService.addConsultaToCollectionIfMissing(consultas, this.editForm.get('consulta')!.value)
        )
      )
      .subscribe((consultas: IConsulta[]) => (this.consultasSharedCollection = consultas));
  }

  protected createFromForm(): IExame {
    return {
      ...new Exame(),
      id: this.editForm.get(['id'])!.value,
      especialidade: this.editForm.get(['especialidade'])!.value,
      medico: this.editForm.get(['medico'])!.value,
      valor: this.editForm.get(['valor'])!.value,
      resultadoContentType: this.editForm.get(['resultadoContentType'])!.value,
      resultado: this.editForm.get(['resultado'])!.value,
      consulta: this.editForm.get(['consulta'])!.value,
    };
  }
}
