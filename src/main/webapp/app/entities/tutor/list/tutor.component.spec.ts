import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TutorService } from '../service/tutor.service';

import { TutorComponent } from './tutor.component';

describe('Component Tests', () => {
  describe('Tutor Management Component', () => {
    let comp: TutorComponent;
    let fixture: ComponentFixture<TutorComponent>;
    let service: TutorService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TutorComponent],
      })
        .overrideTemplate(TutorComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TutorComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(TutorService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.tutors?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
