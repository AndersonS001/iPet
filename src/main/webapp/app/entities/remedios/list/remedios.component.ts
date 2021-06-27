import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRemedios } from '../remedios.model';
import { RemediosService } from '../service/remedios.service';
import { RemediosDeleteDialogComponent } from '../delete/remedios-delete-dialog.component';

@Component({
  selector: 'jhi-remedios',
  templateUrl: './remedios.component.html',
})
export class RemediosComponent implements OnInit {
  remedios?: IRemedios[];
  isLoading = false;

  constructor(protected remediosService: RemediosService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.remediosService.query().subscribe(
      (res: HttpResponse<IRemedios[]>) => {
        this.isLoading = false;
        this.remedios = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IRemedios): number {
    return item.id!;
  }

  delete(remedios: IRemedios): void {
    const modalRef = this.modalService.open(RemediosDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.remedios = remedios;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
