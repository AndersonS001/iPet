import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ExameComponent } from './list/exame.component';
import { ExameDetailComponent } from './detail/exame-detail.component';
import { ExameUpdateComponent } from './update/exame-update.component';
import { ExameDeleteDialogComponent } from './delete/exame-delete-dialog.component';
import { ExameRoutingModule } from './route/exame-routing.module';

@NgModule({
  imports: [SharedModule, ExameRoutingModule],
  declarations: [ExameComponent, ExameDetailComponent, ExameUpdateComponent, ExameDeleteDialogComponent],
  entryComponents: [ExameDeleteDialogComponent],
})
export class ExameModule {}
