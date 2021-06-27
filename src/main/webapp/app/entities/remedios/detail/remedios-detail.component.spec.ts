import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { RemediosDetailComponent } from './remedios-detail.component';

describe('Component Tests', () => {
  describe('Remedios Management Detail Component', () => {
    let comp: RemediosDetailComponent;
    let fixture: ComponentFixture<RemediosDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [RemediosDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ remedios: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(RemediosDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(RemediosDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load remedios on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.remedios).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
