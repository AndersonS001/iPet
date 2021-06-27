import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IConvenio, getConvenioIdentifier } from '../convenio.model';

export type EntityResponseType = HttpResponse<IConvenio>;
export type EntityArrayResponseType = HttpResponse<IConvenio[]>;

@Injectable({ providedIn: 'root' })
export class ConvenioService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/convenios');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(convenio: IConvenio): Observable<EntityResponseType> {
    return this.http.post<IConvenio>(this.resourceUrl, convenio, { observe: 'response' });
  }

  update(convenio: IConvenio): Observable<EntityResponseType> {
    return this.http.put<IConvenio>(`${this.resourceUrl}/${getConvenioIdentifier(convenio) as number}`, convenio, { observe: 'response' });
  }

  partialUpdate(convenio: IConvenio): Observable<EntityResponseType> {
    return this.http.patch<IConvenio>(`${this.resourceUrl}/${getConvenioIdentifier(convenio) as number}`, convenio, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IConvenio>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IConvenio[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addConvenioToCollectionIfMissing(convenioCollection: IConvenio[], ...conveniosToCheck: (IConvenio | null | undefined)[]): IConvenio[] {
    const convenios: IConvenio[] = conveniosToCheck.filter(isPresent);
    if (convenios.length > 0) {
      const convenioCollectionIdentifiers = convenioCollection.map(convenioItem => getConvenioIdentifier(convenioItem)!);
      const conveniosToAdd = convenios.filter(convenioItem => {
        const convenioIdentifier = getConvenioIdentifier(convenioItem);
        if (convenioIdentifier == null || convenioCollectionIdentifiers.includes(convenioIdentifier)) {
          return false;
        }
        convenioCollectionIdentifiers.push(convenioIdentifier);
        return true;
      });
      return [...conveniosToAdd, ...convenioCollection];
    }
    return convenioCollection;
  }
}
