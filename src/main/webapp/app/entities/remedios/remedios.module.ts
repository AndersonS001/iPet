import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { RemediosComponent } from './list/remedios.component';
import { RemediosDetailComponent } from './detail/remedios-detail.component';
import { RemediosUpdateComponent } from './update/remedios-update.component';
import { RemediosDeleteDialogComponent } from './delete/remedios-delete-dialog.component';
import { RemediosRoutingModule } from './route/remedios-routing.module';

@NgModule({
  imports: [SharedModule, RemediosRoutingModule],
  declarations: [RemediosComponent, RemediosDetailComponent, RemediosUpdateComponent, RemediosDeleteDialogComponent],
  entryComponents: [RemediosDeleteDialogComponent],
})
export class RemediosModule {}
