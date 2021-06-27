import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ConvenioDetailComponent } from './convenio-detail.component';

describe('Component Tests', () => {
  describe('Convenio Management Detail Component', () => {
    let comp: ConvenioDetailComponent;
    let fixture: ComponentFixture<ConvenioDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ConvenioDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ convenio: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ConvenioDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ConvenioDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load convenio on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.convenio).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
