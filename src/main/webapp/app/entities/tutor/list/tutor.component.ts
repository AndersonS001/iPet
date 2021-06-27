import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITutor } from '../tutor.model';
import { TutorService } from '../service/tutor.service';
import { TutorDeleteDialogComponent } from '../delete/tutor-delete-dialog.component';

@Component({
  selector: 'jhi-tutor',
  templateUrl: './tutor.component.html',
})
export class TutorComponent implements OnInit {
  tutors?: ITutor[];
  isLoading = false;

  constructor(protected tutorService: TutorService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.tutorService.query().subscribe(
      (res: HttpResponse<ITutor[]>) => {
        this.isLoading = false;
        this.tutors = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ITutor): number {
    return item.id!;
  }

  delete(tutor: ITutor): void {
    const modalRef = this.modalService.open(TutorDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.tutor = tutor;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
