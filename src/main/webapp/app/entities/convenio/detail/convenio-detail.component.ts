import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IConvenio } from '../convenio.model';

@Component({
  selector: 'jhi-convenio-detail',
  templateUrl: './convenio-detail.component.html',
})
export class ConvenioDetailComponent implements OnInit {
  convenio: IConvenio | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ convenio }) => {
      this.convenio = convenio;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
