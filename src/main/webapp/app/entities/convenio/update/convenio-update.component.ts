import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IConvenio, Convenio } from '../convenio.model';
import { ConvenioService } from '../service/convenio.service';
import { IConsulta } from 'app/entities/consulta/consulta.model';
import { ConsultaService } from 'app/entities/consulta/service/consulta.service';

@Component({
  selector: 'jhi-convenio-update',
  templateUrl: './convenio-update.component.html',
})
export class ConvenioUpdateComponent implements OnInit {
  isSaving = false;

  consultasSharedCollection: IConsulta[] = [];

  editForm = this.fb.group({
    id: [],
    nome: [],
    plano: [],
    valor: [],
    consultas: [],
  });

  constructor(
    protected convenioService: ConvenioService,
    protected consultaService: ConsultaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ convenio }) => {
      this.updateForm(convenio);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const convenio = this.createFromForm();
    if (convenio.id !== undefined) {
      this.subscribeToSaveResponse(this.convenioService.update(convenio));
    } else {
      this.subscribeToSaveResponse(this.convenioService.create(convenio));
    }
  }

  trackConsultaById(index: number, item: IConsulta): number {
    return item.id!;
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

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IConvenio>>): void {
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

  protected updateForm(convenio: IConvenio): void {
    this.editForm.patchValue({
      id: convenio.id,
      nome: convenio.nome,
      plano: convenio.plano,
      valor: convenio.valor,
      consultas: convenio.consultas,
    });

    this.consultasSharedCollection = this.consultaService.addConsultaToCollectionIfMissing(
      this.consultasSharedCollection,
      ...(convenio.consultas ?? [])
    );
  }

  protected loadRelationshipsOptions(): void {
    this.consultaService
      .query()
      .pipe(map((res: HttpResponse<IConsulta[]>) => res.body ?? []))
      .pipe(
        map((consultas: IConsulta[]) =>
          this.consultaService.addConsultaToCollectionIfMissing(consultas, ...(this.editForm.get('consultas')!.value ?? []))
        )
      )
      .subscribe((consultas: IConsulta[]) => (this.consultasSharedCollection = consultas));
  }

  protected createFromForm(): IConvenio {
    return {
      ...new Convenio(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      plano: this.editForm.get(['plano'])!.value,
      valor: this.editForm.get(['valor'])!.value,
      consultas: this.editForm.get(['consultas'])!.value,
    };
  }
}
