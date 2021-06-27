import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ITutor, Tutor } from '../tutor.model';

import { TutorService } from './tutor.service';

describe('Service Tests', () => {
  describe('Tutor Service', () => {
    let service: TutorService;
    let httpMock: HttpTestingController;
    let elemDefault: ITutor;
    let expectedResult: ITutor | ITutor[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(TutorService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        nome: 'AAAAAAA',
        email: 'AAAAAAA',
        dataNascimento: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            dataNascimento: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Tutor', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            dataNascimento: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dataNascimento: currentDate,
          },
          returnedFromService
        );

        service.create(new Tutor()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Tutor', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nome: 'BBBBBB',
            email: 'BBBBBB',
            dataNascimento: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dataNascimento: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Tutor', () => {
        const patchObject = Object.assign(
          {
            nome: 'BBBBBB',
          },
          new Tutor()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            dataNascimento: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Tutor', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            nome: 'BBBBBB',
            email: 'BBBBBB',
            dataNascimento: currentDate.format(DATE_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            dataNascimento: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Tutor', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addTutorToCollectionIfMissing', () => {
        it('should add a Tutor to an empty array', () => {
          const tutor: ITutor = { id: 123 };
          expectedResult = service.addTutorToCollectionIfMissing([], tutor);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(tutor);
        });

        it('should not add a Tutor to an array that contains it', () => {
          const tutor: ITutor = { id: 123 };
          const tutorCollection: ITutor[] = [
            {
              ...tutor,
            },
            { id: 456 },
          ];
          expectedResult = service.addTutorToCollectionIfMissing(tutorCollection, tutor);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Tutor to an array that doesn't contain it", () => {
          const tutor: ITutor = { id: 123 };
          const tutorCollection: ITutor[] = [{ id: 456 }];
          expectedResult = service.addTutorToCollectionIfMissing(tutorCollection, tutor);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(tutor);
        });

        it('should add only unique Tutor to an array', () => {
          const tutorArray: ITutor[] = [{ id: 123 }, { id: 456 }, { id: 43240 }];
          const tutorCollection: ITutor[] = [{ id: 123 }];
          expectedResult = service.addTutorToCollectionIfMissing(tutorCollection, ...tutorArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const tutor: ITutor = { id: 123 };
          const tutor2: ITutor = { id: 456 };
          expectedResult = service.addTutorToCollectionIfMissing([], tutor, tutor2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(tutor);
          expect(expectedResult).toContain(tutor2);
        });

        it('should accept null and undefined values', () => {
          const tutor: ITutor = { id: 123 };
          expectedResult = service.addTutorToCollectionIfMissing([], null, tutor, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(tutor);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
