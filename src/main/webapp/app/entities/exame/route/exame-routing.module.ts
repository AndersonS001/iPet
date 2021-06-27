import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ExameComponent } from '../list/exame.component';
import { ExameDetailComponent } from '../detail/exame-detail.component';
import { ExameUpdateComponent } from '../update/exame-update.component';
import { ExameRoutingResolveService } from './exame-routing-resolve.service';

const exameRoute: Routes = [
  {
    path: '',
    component: ExameComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ExameDetailComponent,
    resolve: {
      exame: ExameRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ExameUpdateComponent,
    resolve: {
      exame: ExameRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ExameUpdateComponent,
    resolve: {
      exame: ExameRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(exameRoute)],
  exports: [RouterModule],
})
export class ExameRoutingModule {}
