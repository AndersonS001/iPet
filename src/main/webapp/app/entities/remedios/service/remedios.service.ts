import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IRemedios, getRemediosIdentifier } from '../remedios.model';

export type EntityResponseType = HttpResponse<IRemedios>;
export type EntityArrayResponseType = HttpResponse<IRemedios[]>;

@Injectable({ providedIn: 'root' })
export class RemediosService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/remedios');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(remedios: IRemedios): Observable<EntityResponseType> {
    return this.http.post<IRemedios>(this.resourceUrl, remedios, { observe: 'response' });
  }

  update(remedios: IRemedios): Observable<EntityResponseType> {
    return this.http.put<IRemedios>(`${this.resourceUrl}/${getRemediosIdentifier(remedios) as number}`, remedios, { observe: 'response' });
  }

  partialUpdate(remedios: IRemedios): Observable<EntityResponseType> {
    return this.http.patch<IRemedios>(`${this.resourceUrl}/${getRemediosIdentifier(remedios) as number}`, remedios, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IRemedios>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IRemedios[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addRemediosToCollectionIfMissing(remediosCollection: IRemedios[], ...remediosToCheck: (IRemedios | null | undefined)[]): IRemedios[] {
    const remedios: IRemedios[] = remediosToCheck.filter(isPresent);
    if (remedios.length > 0) {
      const remediosCollectionIdentifiers = remediosCollection.map(remediosItem => getRemediosIdentifier(remediosItem)!);
      const remediosToAdd = remedios.filter(remediosItem => {
        const remediosIdentifier = getRemediosIdentifier(remediosItem);
        if (remediosIdentifier == null || remediosCollectionIdentifiers.includes(remediosIdentifier)) {
          return false;
        }
        remediosCollectionIdentifiers.push(remediosIdentifier);
        return true;
      });
      return [...remediosToAdd, ...remediosCollection];
    }
    return remediosCollection;
  }
}
