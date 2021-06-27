import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPet } from '../pet.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-pet-detail',
  templateUrl: './pet-detail.component.html',
})
export class PetDetailComponent implements OnInit {
  pet: IPet | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pet }) => {
      this.pet = pet;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
