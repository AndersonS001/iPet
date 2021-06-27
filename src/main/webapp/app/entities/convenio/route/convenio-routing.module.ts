import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ConvenioComponent } from '../list/convenio.component';
import { ConvenioDetailComponent } from '../detail/convenio-detail.component';
import { ConvenioUpdateComponent } from '../update/convenio-update.component';
import { ConvenioRoutingResolveService } from './convenio-routing-resolve.service';

const convenioRoute: Routes = [
  {
    path: '',
    component: ConvenioComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ConvenioDetailComponent,
    resolve: {
      convenio: ConvenioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ConvenioUpdateComponent,
    resolve: {
      convenio: ConvenioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ConvenioUpdateComponent,
    resolve: {
      convenio: ConvenioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(convenioRoute)],
  exports: [RouterModule],
})
export class ConvenioRoutingModule {}
