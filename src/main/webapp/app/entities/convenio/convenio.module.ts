import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ConvenioComponent } from './list/convenio.component';
import { ConvenioDetailComponent } from './detail/convenio-detail.component';
import { ConvenioUpdateComponent } from './update/convenio-update.component';
import { ConvenioDeleteDialogComponent } from './delete/convenio-delete-dialog.component';
import { ConvenioRoutingModule } from './route/convenio-routing.module';

@NgModule({
  imports: [SharedModule, ConvenioRoutingModule],
  declarations: [ConvenioComponent, ConvenioDetailComponent, ConvenioUpdateComponent, ConvenioDeleteDialogComponent],
  entryComponents: [ConvenioDeleteDialogComponent],
})
export class ConvenioModule {}
