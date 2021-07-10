import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IRemedios, Remedios } from '../remedios.model';
import { RemediosService } from '../service/remedios.service';

@Component({
  selector: 'jhi-remedios-update',
  templateUrl: './remedios-update.component.html',
})
export class RemediosUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nome: [],
    fabricante: [],
    tipo: [],
  });

  constructor(protected remediosService: RemediosService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ remedios }) => {
      this.updateForm(remedios);
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
    });
  }

  protected createFromForm(): IRemedios {
    return {
      ...new Remedios(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      fabricante: this.editForm.get(['fabricante'])!.value,
      tipo: this.editForm.get(['tipo'])!.value,
    };
  }
}
