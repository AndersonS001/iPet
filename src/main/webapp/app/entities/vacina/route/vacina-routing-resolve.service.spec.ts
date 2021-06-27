jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IVacina, Vacina } from '../vacina.model';
import { VacinaService } from '../service/vacina.service';

import { VacinaRoutingResolveService } from './vacina-routing-resolve.service';

describe('Service Tests', () => {
  describe('Vacina routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: VacinaRoutingResolveService;
    let service: VacinaService;
    let resultVacina: IVacina | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(VacinaRoutingResolveService);
      service = TestBed.inject(VacinaService);
      resultVacina = undefined;
    });

    describe('resolve', () => {
      it('should return IVacina returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultVacina = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultVacina).toEqual({ id: 123 });
      });

      it('should return new IVacina if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultVacina = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultVacina).toEqual(new Vacina());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultVacina = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultVacina).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
