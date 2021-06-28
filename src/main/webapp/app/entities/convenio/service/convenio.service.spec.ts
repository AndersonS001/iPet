import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IConvenio, Convenio } from '../convenio.model';

import { ConvenioService } from './convenio.service';

describe('Service Tests', () => {
  describe('Convenio Service', () => {
    let service: ConvenioService;
    let httpMock: HttpTestingController;
    let elemDefault: IConvenio;
    let expectedResult: IConvenio | IConvenio[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ConvenioService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        nome: 'AAAAAAA',
        plano: 'AAAAAAA',
        valor: 0,
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

      it('should create a Convenio', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Convenio()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Convenio', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nome: 'BBBBBB',
            plano: 'BBBBBB',
            valor: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Convenio', () => {
        const patchObject = Object.assign(
          {
            valor: 1,
          },
          new Convenio()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Convenio', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nome: 'BBBBBB',
            plano: 'BBBBBB',
            valor: 1,
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

      it('should delete a Convenio', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addConvenioToCollectionIfMissing', () => {
        it('should add a Convenio to an empty array', () => {
          const convenio: IConvenio = { id: 123 };
          expectedResult = service.addConvenioToCollectionIfMissing([], convenio);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(convenio);
        });

        it('should not add a Convenio to an array that contains it', () => {
          const convenio: IConvenio = { id: 123 };
          const convenioCollection: IConvenio[] = [
            {
              ...convenio,
            },
            { id: 456 },
          ];
          expectedResult = service.addConvenioToCollectionIfMissing(convenioCollection, convenio);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Convenio to an array that doesn't contain it", () => {
          const convenio: IConvenio = { id: 123 };
          const convenioCollection: IConvenio[] = [{ id: 456 }];
          expectedResult = service.addConvenioToCollectionIfMissing(convenioCollection, convenio);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(convenio);
        });

        it('should add only unique Convenio to an array', () => {
          const convenioArray: IConvenio[] = [{ id: 123 }, { id: 456 }, { id: 94706 }];
          const convenioCollection: IConvenio[] = [{ id: 123 }];
          expectedResult = service.addConvenioToCollectionIfMissing(convenioCollection, ...convenioArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const convenio: IConvenio = { id: 123 };
          const convenio2: IConvenio = { id: 456 };
          expectedResult = service.addConvenioToCollectionIfMissing([], convenio, convenio2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(convenio);
          expect(expectedResult).toContain(convenio2);
        });

        it('should accept null and undefined values', () => {
          const convenio: IConvenio = { id: 123 };
          expectedResult = service.addConvenioToCollectionIfMissing([], null, convenio, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(convenio);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
