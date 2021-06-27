import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IExame, getExameIdentifier } from '../exame.model';

export type EntityResponseType = HttpResponse<IExame>;
export type EntityArrayResponseType = HttpResponse<IExame[]>;

@Injectable({ providedIn: 'root' })
export class ExameService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/exames');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(exame: IExame): Observable<EntityResponseType> {
    return this.http.post<IExame>(this.resourceUrl, exame, { observe: 'response' });
  }

  update(exame: IExame): Observable<EntityResponseType> {
    return this.http.put<IExame>(`${this.resourceUrl}/${getExameIdentifier(exame) as number}`, exame, { observe: 'response' });
  }

  partialUpdate(exame: IExame): Observable<EntityResponseType> {
    return this.http.patch<IExame>(`${this.resourceUrl}/${getExameIdentifier(exame) as number}`, exame, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IExame>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IExame[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addExameToCollectionIfMissing(exameCollection: IExame[], ...examesToCheck: (IExame | null | undefined)[]): IExame[] {
    const exames: IExame[] = examesToCheck.filter(isPresent);
    if (exames.length > 0) {
      const exameCollectionIdentifiers = exameCollection.map(exameItem => getExameIdentifier(exameItem)!);
      const examesToAdd = exames.filter(exameItem => {
        const exameIdentifier = getExameIdentifier(exameItem);
        if (exameIdentifier == null || exameCollectionIdentifiers.includes(exameIdentifier)) {
          return false;
        }
        exameCollectionIdentifiers.push(exameIdentifier);
        return true;
      });
      return [...examesToAdd, ...exameCollection];
    }
    return exameCollection;
  }
}
