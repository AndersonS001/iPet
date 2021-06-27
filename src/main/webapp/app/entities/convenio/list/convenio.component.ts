import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IConvenio } from '../convenio.model';
import { ConvenioService } from '../service/convenio.service';
import { ConvenioDeleteDialogComponent } from '../delete/convenio-delete-dialog.component';

@Component({
  selector: 'jhi-convenio',
  templateUrl: './convenio.component.html',
})
export class ConvenioComponent implements OnInit {
  convenios?: IConvenio[];
  isLoading = false;

  constructor(protected convenioService: ConvenioService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.convenioService.query().subscribe(
      (res: HttpResponse<IConvenio[]>) => {
        this.isLoading = false;
        this.convenios = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IConvenio): number {
    return item.id!;
  }

  delete(convenio: IConvenio): void {
    const modalRef = this.modalService.open(ConvenioDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.convenio = convenio;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
