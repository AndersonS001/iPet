import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RemediosComponent } from '../list/remedios.component';
import { RemediosDetailComponent } from '../detail/remedios-detail.component';
import { RemediosUpdateComponent } from '../update/remedios-update.component';
import { RemediosRoutingResolveService } from './remedios-routing-resolve.service';

const remediosRoute: Routes = [
  {
    path: '',
    component: RemediosComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RemediosDetailComponent,
    resolve: {
      remedios: RemediosRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RemediosUpdateComponent,
    resolve: {
      remedios: RemediosRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RemediosUpdateComponent,
    resolve: {
      remedios: RemediosRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(remediosRoute)],
  exports: [RouterModule],
})
export class RemediosRoutingModule {}
