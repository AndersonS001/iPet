import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IRemedios } from '../remedios.model';

@Component({
  selector: 'jhi-remedios-detail',
  templateUrl: './remedios-detail.component.html',
})
export class RemediosDetailComponent implements OnInit {
  remedios: IRemedios | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ remedios }) => {
      this.remedios = remedios;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
