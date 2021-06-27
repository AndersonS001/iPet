import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVacina, getVacinaIdentifier } from '../vacina.model';

export type EntityResponseType = HttpResponse<IVacina>;
export type EntityArrayResponseType = HttpResponse<IVacina[]>;

@Injectable({ providedIn: 'root' })
export class VacinaService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/vacinas');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(vacina: IVacina): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vacina);
    return this.http
      .post<IVacina>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(vacina: IVacina): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vacina);
    return this.http
      .put<IVacina>(`${this.resourceUrl}/${getVacinaIdentifier(vacina) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(vacina: IVacina): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vacina);
    return this.http
      .patch<IVacina>(`${this.resourceUrl}/${getVacinaIdentifier(vacina) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IVacina>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IVacina[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addVacinaToCollectionIfMissing(vacinaCollection: IVacina[], ...vacinasToCheck: (IVacina | null | undefined)[]): IVacina[] {
    const vacinas: IVacina[] = vacinasToCheck.filter(isPresent);
    if (vacinas.length > 0) {
      const vacinaCollectionIdentifiers = vacinaCollection.map(vacinaItem => getVacinaIdentifier(vacinaItem)!);
      const vacinasToAdd = vacinas.filter(vacinaItem => {
        const vacinaIdentifier = getVacinaIdentifier(vacinaItem);
        if (vacinaIdentifier == null || vacinaCollectionIdentifiers.includes(vacinaIdentifier)) {
          return false;
        }
        vacinaCollectionIdentifiers.push(vacinaIdentifier);
        return true;
      });
      return [...vacinasToAdd, ...vacinaCollection];
    }
    return vacinaCollection;
  }

  protected convertDateFromClient(vacina: IVacina): IVacina {
    return Object.assign({}, vacina, {
      dataAplicacao: vacina.dataAplicacao?.isValid() ? vacina.dataAplicacao.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dataAplicacao = res.body.dataAplicacao ? dayjs(res.body.dataAplicacao) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((vacina: IVacina) => {
        vacina.dataAplicacao = vacina.dataAplicacao ? dayjs(vacina.dataAplicacao) : undefined;
      });
    }
    return res;
  }
}
