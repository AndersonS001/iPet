import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IConvenio } from '../convenio.model';
import { ConvenioService } from '../service/convenio.service';

@Component({
  templateUrl: './convenio-delete-dialog.component.html',
})
export class ConvenioDeleteDialogComponent {
  convenio?: IConvenio;

  constructor(protected convenioService: ConvenioService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.convenioService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
