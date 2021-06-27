import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITutor, getTutorIdentifier } from '../tutor.model';

export type EntityResponseType = HttpResponse<ITutor>;
export type EntityArrayResponseType = HttpResponse<ITutor[]>;

@Injectable({ providedIn: 'root' })
export class TutorService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/tutors');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(tutor: ITutor): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tutor);
    return this.http
      .post<ITutor>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(tutor: ITutor): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tutor);
    return this.http
      .put<ITutor>(`${this.resourceUrl}/${getTutorIdentifier(tutor) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(tutor: ITutor): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(tutor);
    return this.http
      .patch<ITutor>(`${this.resourceUrl}/${getTutorIdentifier(tutor) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ITutor>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ITutor[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTutorToCollectionIfMissing(tutorCollection: ITutor[], ...tutorsToCheck: (ITutor | null | undefined)[]): ITutor[] {
    const tutors: ITutor[] = tutorsToCheck.filter(isPresent);
    if (tutors.length > 0) {
      const tutorCollectionIdentifiers = tutorCollection.map(tutorItem => getTutorIdentifier(tutorItem)!);
      const tutorsToAdd = tutors.filter(tutorItem => {
        const tutorIdentifier = getTutorIdentifier(tutorItem);
        if (tutorIdentifier == null || tutorCollectionIdentifiers.includes(tutorIdentifier)) {
          return false;
        }
        tutorCollectionIdentifiers.push(tutorIdentifier);
        return true;
      });
      return [...tutorsToAdd, ...tutorCollection];
    }
    return tutorCollection;
  }

  protected convertDateFromClient(tutor: ITutor): ITutor {
    return Object.assign({}, tutor, {
      dataNascimento: tutor.dataNascimento?.isValid() ? tutor.dataNascimento.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dataNascimento = res.body.dataNascimento ? dayjs(res.body.dataNascimento) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((tutor: ITutor) => {
        tutor.dataNascimento = tutor.dataNascimento ? dayjs(tutor.dataNascimento) : undefined;
      });
    }
    return res;
  }
}
