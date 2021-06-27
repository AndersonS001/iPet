import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPet, getPetIdentifier } from '../pet.model';

export type EntityResponseType = HttpResponse<IPet>;
export type EntityArrayResponseType = HttpResponse<IPet[]>;

@Injectable({ providedIn: 'root' })
export class PetService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/pets');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(pet: IPet): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pet);
    return this.http
      .post<IPet>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(pet: IPet): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pet);
    return this.http
      .put<IPet>(`${this.resourceUrl}/${getPetIdentifier(pet) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(pet: IPet): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(pet);
    return this.http
      .patch<IPet>(`${this.resourceUrl}/${getPetIdentifier(pet) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPet>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPet[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPetToCollectionIfMissing(petCollection: IPet[], ...petsToCheck: (IPet | null | undefined)[]): IPet[] {
    const pets: IPet[] = petsToCheck.filter(isPresent);
    if (pets.length > 0) {
      const petCollectionIdentifiers = petCollection.map(petItem => getPetIdentifier(petItem)!);
      const petsToAdd = pets.filter(petItem => {
        const petIdentifier = getPetIdentifier(petItem);
        if (petIdentifier == null || petCollectionIdentifiers.includes(petIdentifier)) {
          return false;
        }
        petCollectionIdentifiers.push(petIdentifier);
        return true;
      });
      return [...petsToAdd, ...petCollection];
    }
    return petCollection;
  }

  protected convertDateFromClient(pet: IPet): IPet {
    return Object.assign({}, pet, {
      dataNascimento: pet.dataNascimento?.isValid() ? pet.dataNascimento.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((pet: IPet) => {
        pet.dataNascimento = pet.dataNascimento ? dayjs(pet.dataNascimento) : undefined;
      });
    }
    return res;
  }
}
