jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IExame, Exame } from '../exame.model';
import { ExameService } from '../service/exame.service';

import { ExameRoutingResolveService } from './exame-routing-resolve.service';

describe('Service Tests', () => {
  describe('Exame routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ExameRoutingResolveService;
    let service: ExameService;
    let resultExame: IExame | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ExameRoutingResolveService);
      service = TestBed.inject(ExameService);
      resultExame = undefined;
    });

    describe('resolve', () => {
      it('should return IExame returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultExame = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultExame).toEqual({ id: 123 });
      });

      it('should return new IExame if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultExame = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultExame).toEqual(new Exame());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultExame = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultExame).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
