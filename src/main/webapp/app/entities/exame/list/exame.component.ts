import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IExame } from '../exame.model';
import { ExameService } from '../service/exame.service';
import { ExameDeleteDialogComponent } from '../delete/exame-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-exame',
  templateUrl: './exame.component.html',
})
export class ExameComponent implements OnInit {
  exames?: IExame[];
  isLoading = false;

  constructor(protected exameService: ExameService, protected dataUtils: DataUtils, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.exameService.query().subscribe(
      (res: HttpResponse<IExame[]>) => {
        this.isLoading = false;
        this.exames = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IExame): number {
    return item.id!;
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(exame: IExame): void {
    const modalRef = this.modalService.open(ExameDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.exame = exame;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
