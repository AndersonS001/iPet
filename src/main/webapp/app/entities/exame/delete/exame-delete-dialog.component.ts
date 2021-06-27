import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IExame } from '../exame.model';
import { ExameService } from '../service/exame.service';

@Component({
  templateUrl: './exame-delete-dialog.component.html',
})
export class ExameDeleteDialogComponent {
  exame?: IExame;

  constructor(protected exameService: ExameService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.exameService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
