import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { TipoRemedio } from 'app/entities/enumerations/tipo-remedio.model';
import { IRemedios, Remedios } from '../remedios.model';

import { RemediosService } from './remedios.service';

describe('Service Tests', () => {
  describe('Remedios Service', () => {
    let service: RemediosService;
    let httpMock: HttpTestingController;
    let elemDefault: IRemedios;
    let expectedResult: IRemedios | IRemedios[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(RemediosService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        nome: 'AAAAAAA',
        fabricante: 'AAAAAAA',
        tipo: TipoRemedio.COMPRIMIDO,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Remedios', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Remedios()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Remedios', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nome: 'BBBBBB',
            fabricante: 'BBBBBB',
            tipo: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Remedios', () => {
        const patchObject = Object.assign(
          {
            nome: 'BBBBBB',
          },
          new Remedios()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Remedios', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nome: 'BBBBBB',
            fabricante: 'BBBBBB',
            tipo: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Remedios', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addRemediosToCollectionIfMissing', () => {
        it('should add a Remedios to an empty array', () => {
          const remedios: IRemedios = { id: 123 };
          expectedResult = service.addRemediosToCollectionIfMissing([], remedios);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(remedios);
        });

        it('should not add a Remedios to an array that contains it', () => {
          const remedios: IRemedios = { id: 123 };
          const remediosCollection: IRemedios[] = [
            {
              ...remedios,
            },
            { id: 456 },
          ];
          expectedResult = service.addRemediosToCollectionIfMissing(remediosCollection, remedios);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Remedios to an array that doesn't contain it", () => {
          const remedios: IRemedios = { id: 123 };
          const remediosCollection: IRemedios[] = [{ id: 456 }];
          expectedResult = service.addRemediosToCollectionIfMissing(remediosCollection, remedios);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(remedios);
        });

        it('should add only unique Remedios to an array', () => {
          const remediosArray: IRemedios[] = [{ id: 123 }, { id: 456 }, { id: 55166 }];
          const remediosCollection: IRemedios[] = [{ id: 123 }];
          expectedResult = service.addRemediosToCollectionIfMissing(remediosCollection, ...remediosArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const remedios: IRemedios = { id: 123 };
          const remedios2: IRemedios = { id: 456 };
          expectedResult = service.addRemediosToCollectionIfMissing([], remedios, remedios2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(remedios);
          expect(expectedResult).toContain(remedios2);
        });

        it('should accept null and undefined values', () => {
          const remedios: IRemedios = { id: 123 };
          expectedResult = service.addRemediosToCollectionIfMissing([], null, remedios, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(remedios);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
