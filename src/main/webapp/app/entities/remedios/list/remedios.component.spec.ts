import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { RemediosService } from '../service/remedios.service';

import { RemediosComponent } from './remedios.component';

describe('Component Tests', () => {
  describe('Remedios Management Component', () => {
    let comp: RemediosComponent;
    let fixture: ComponentFixture<RemediosComponent>;
    let service: RemediosService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [RemediosComponent],
      })
        .overrideTemplate(RemediosComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(RemediosComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(RemediosService);

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
      expect(comp.remedios?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
