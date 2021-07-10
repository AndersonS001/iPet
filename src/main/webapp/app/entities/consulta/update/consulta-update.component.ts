import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IConsulta, Consulta } from '../consulta.model';
import { ConsultaService } from '../service/consulta.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IRemedios } from 'app/entities/remedios/remedios.model';
import { RemediosService } from 'app/entities/remedios/service/remedios.service';
import { IExame } from 'app/entities/exame/exame.model';
import { ExameService } from 'app/entities/exame/service/exame.service';

@Component({
  selector: 'jhi-consulta-update',
  templateUrl: './consulta-update.component.html',
})
export class ConsultaUpdateComponent implements OnInit {
  isSaving = false;

  remediosSharedCollection: IRemedios[] = [];
  examesSharedCollection: IExame[] = [];

  editForm = this.fb.group({
    id: [],
    especialidade: [],
    medico: [],
    valor: [],
    receita: [],
    receitaContentType: [],
    remedios: [],
    exames: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected consultaService: ConsultaService,
    protected remediosService: RemediosService,
    protected exameService: ExameService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ consulta }) => {
      this.updateForm(consulta);

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
    const consulta = this.createFromForm();
    if (consulta.id !== undefined) {
      this.subscribeToSaveResponse(this.consultaService.update(consulta));
    } else {
      this.subscribeToSaveResponse(this.consultaService.create(consulta));
    }
  }

  trackRemediosById(index: number, item: IRemedios): number {
    return item.id!;
  }

  trackExameById(index: number, item: IExame): number {
    return item.id!;
  }

  getSelectedRemedios(option: IRemedios, selectedVals?: IRemedios[]): IRemedios {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  getSelectedExame(option: IExame, selectedVals?: IExame[]): IExame {
    if (selectedVals) {
      for (const selectedVal of selectedVals) {
        if (option.id === selectedVal.id) {
          return selectedVal;
        }
      }
    }
    return option;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IConsulta>>): void {
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

  protected updateForm(consulta: IConsulta): void {
    this.editForm.patchValue({
      id: consulta.id,
      especialidade: consulta.especialidade,
      medico: consulta.medico,
      valor: consulta.valor,
      receita: consulta.receita,
      receitaContentType: consulta.receitaContentType,
      remedios: consulta.remedios,
      exames: consulta.exames,
    });

    this.remediosSharedCollection = this.remediosService.addRemediosToCollectionIfMissing(
      this.remediosSharedCollection,
      ...(consulta.remedios ?? [])
    );
    this.examesSharedCollection = this.exameService.addExameToCollectionIfMissing(this.examesSharedCollection, ...(consulta.exames ?? []));
  }

  protected loadRelationshipsOptions(): void {
    this.remediosService
      .query()
      .pipe(map((res: HttpResponse<IRemedios[]>) => res.body ?? []))
      .pipe(
        map((remedios: IRemedios[]) =>
          this.remediosService.addRemediosToCollectionIfMissing(remedios, ...(this.editForm.get('remedios')!.value ?? []))
        )
      )
      .subscribe((remedios: IRemedios[]) => (this.remediosSharedCollection = remedios));

    this.exameService
      .query()
      .pipe(map((res: HttpResponse<IExame[]>) => res.body ?? []))
      .pipe(
        map((exames: IExame[]) => this.exameService.addExameToCollectionIfMissing(exames, ...(this.editForm.get('exames')!.value ?? [])))
      )
      .subscribe((exames: IExame[]) => (this.examesSharedCollection = exames));
  }

  protected createFromForm(): IConsulta {
    return {
      ...new Consulta(),
      id: this.editForm.get(['id'])!.value,
      especialidade: this.editForm.get(['especialidade'])!.value,
      medico: this.editForm.get(['medico'])!.value,
      valor: this.editForm.get(['valor'])!.value,
      receitaContentType: this.editForm.get(['receitaContentType'])!.value,
      receita: this.editForm.get(['receita'])!.value,
      remedios: this.editForm.get(['remedios'])!.value,
      exames: this.editForm.get(['exames'])!.value,
    };
  }
}
