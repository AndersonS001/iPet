import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IExame, Exame } from '../exame.model';

import { ExameService } from './exame.service';

describe('Service Tests', () => {
  describe('Exame Service', () => {
    let service: ExameService;
    let httpMock: HttpTestingController;
    let elemDefault: IExame;
    let expectedResult: IExame | IExame[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ExameService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        especialidade: 'AAAAAAA',
        medico: 'AAAAAAA',
        valor: 0,
        resultadoContentType: 'image/png',
        resultado: 'AAAAAAA',
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

      it('should create a Exame', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Exame()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Exame', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            especialidade: 'BBBBBB',
            medico: 'BBBBBB',
            valor: 1,
            resultado: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Exame', () => {
        const patchObject = Object.assign(
          {
            especialidade: 'BBBBBB',
            valor: 1,
          },
          new Exame()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Exame', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            especialidade: 'BBBBBB',
            medico: 'BBBBBB',
            valor: 1,
            resultado: 'BBBBBB',
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

      it('should delete a Exame', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addExameToCollectionIfMissing', () => {
        it('should add a Exame to an empty array', () => {
          const exame: IExame = { id: 123 };
          expectedResult = service.addExameToCollectionIfMissing([], exame);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(exame);
        });

        it('should not add a Exame to an array that contains it', () => {
          const exame: IExame = { id: 123 };
          const exameCollection: IExame[] = [
            {
              ...exame,
            },
            { id: 456 },
          ];
          expectedResult = service.addExameToCollectionIfMissing(exameCollection, exame);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Exame to an array that doesn't contain it", () => {
          const exame: IExame = { id: 123 };
          const exameCollection: IExame[] = [{ id: 456 }];
          expectedResult = service.addExameToCollectionIfMissing(exameCollection, exame);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(exame);
        });

        it('should add only unique Exame to an array', () => {
          const exameArray: IExame[] = [{ id: 123 }, { id: 456 }, { id: 91827 }];
          const exameCollection: IExame[] = [{ id: 123 }];
          expectedResult = service.addExameToCollectionIfMissing(exameCollection, ...exameArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const exame: IExame = { id: 123 };
          const exame2: IExame = { id: 456 };
          expectedResult = service.addExameToCollectionIfMissing([], exame, exame2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(exame);
          expect(expectedResult).toContain(exame2);
        });

        it('should accept null and undefined values', () => {
          const exame: IExame = { id: 123 };
          expectedResult = service.addExameToCollectionIfMissing([], null, exame, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(exame);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
