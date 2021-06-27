import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IConsulta, Consulta } from '../consulta.model';
import { ConsultaService } from '../service/consulta.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-consulta-update',
  templateUrl: './consulta-update.component.html',
})
export class ConsultaUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    especialidade: [],
    medico: [],
    valor: [],
    receita: [],
    receitaContentType: [],
  });

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected consultaService: ConsultaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ consulta }) => {
      this.updateForm(consulta);
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
    });
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
    };
  }
}
