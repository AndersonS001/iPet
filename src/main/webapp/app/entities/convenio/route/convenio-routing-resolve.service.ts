import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IConvenio, Convenio } from '../convenio.model';
import { ConvenioService } from '../service/convenio.service';

@Injectable({ providedIn: 'root' })
export class ConvenioRoutingResolveService implements Resolve<IConvenio> {
  constructor(protected service: ConvenioService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IConvenio> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((convenio: HttpResponse<Convenio>) => {
          if (convenio.body) {
            return of(convenio.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Convenio());
  }
}
