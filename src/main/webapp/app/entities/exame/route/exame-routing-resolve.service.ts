import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IExame, Exame } from '../exame.model';
import { ExameService } from '../service/exame.service';

@Injectable({ providedIn: 'root' })
export class ExameRoutingResolveService implements Resolve<IExame> {
  constructor(protected service: ExameService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IExame> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((exame: HttpResponse<Exame>) => {
          if (exame.body) {
            return of(exame.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Exame());
  }
}
