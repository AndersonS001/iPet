import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPet } from '../pet.model';
import { PetService } from '../service/pet.service';

@Component({
  templateUrl: './pet-delete-dialog.component.html',
})
export class PetDeleteDialogComponent {
  pet?: IPet;

  constructor(protected petService: PetService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.petService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
