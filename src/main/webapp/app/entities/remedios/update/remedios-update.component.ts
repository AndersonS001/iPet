import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IRemedios, Remedios } from '../remedios.model';
import { RemediosService } from '../service/remedios.service';
import { IConsulta } from 'app/entities/consulta/consulta.model';
import { ConsultaService } from 'app/entities/consulta/service/consulta.service';

@Component({
  selector: 'jhi-remedios-update',
  templateUrl: './remedios-update.component.html',
})
export class RemediosUpdateComponent implements OnInit {
  isSaving = false;

  consultasSharedCollection: IConsulta[] = [];

  editForm = this.fb.group({
    id: [],
    nome: [],
    fabricante: [],
    tipo: [],
    consulta: [],
  });

  constructor(
    protected remediosService: RemediosService,
    protected consultaService: ConsultaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ remedios }) => {
      this.updateForm(remedios);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const remedios = this.createFromForm();
    if (remedios.id !== undefined) {
      this.subscribeToSaveResponse(this.remediosService.update(remedios));
    } else {
      this.subscribeToSaveResponse(this.remediosService.create(remedios));
    }
  }

  trackConsultaById(index: number, item: IConsulta): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRemedios>>): void {
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

  protected updateForm(remedios: IRemedios): void {
    this.editForm.patchValue({
      id: remedios.id,
      nome: remedios.nome,
      fabricante: remedios.fabricante,
      tipo: remedios.tipo,
      consulta: remedios.consulta,
    });

    this.consultasSharedCollection = this.consultaService.addConsultaToCollectionIfMissing(
      this.consultasSharedCollection,
      remedios.consulta
    );
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

  protected createFromForm(): IRemedios {
    return {
      ...new Remedios(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      fabricante: this.editForm.get(['fabricante'])!.value,
      tipo: this.editForm.get(['tipo'])!.value,
      consulta: this.editForm.get(['consulta'])!.value,
    };
  }
}
