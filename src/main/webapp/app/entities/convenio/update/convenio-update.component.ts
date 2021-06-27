import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IConvenio, Convenio } from '../convenio.model';
import { ConvenioService } from '../service/convenio.service';

@Component({
  selector: 'jhi-convenio-update',
  templateUrl: './convenio-update.component.html',
})
export class ConvenioUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nome: [],
    email: [],
    valor: [],
  });

  constructor(protected convenioService: ConvenioService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ convenio }) => {
      this.updateForm(convenio);
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
      email: convenio.email,
      valor: convenio.valor,
    });
  }

  protected createFromForm(): IConvenio {
    return {
      ...new Convenio(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      email: this.editForm.get(['email'])!.value,
      valor: this.editForm.get(['valor'])!.value,
    };
  }
}
