import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRemedios } from '../remedios.model';
import { RemediosService } from '../service/remedios.service';

@Component({
  templateUrl: './remedios-delete-dialog.component.html',
})
export class RemediosDeleteDialogComponent {
  remedios?: IRemedios;

  constructor(protected remediosService: RemediosService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.remediosService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
