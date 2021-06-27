import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'vacina',
        data: { pageTitle: 'iPetApp.vacina.home.title' },
        loadChildren: () => import('./vacina/vacina.module').then(m => m.VacinaModule),
      },
      {
        path: 'pet',
        data: { pageTitle: 'iPetApp.pet.home.title' },
        loadChildren: () => import('./pet/pet.module').then(m => m.PetModule),
      },
      {
        path: 'tutor',
        data: { pageTitle: 'iPetApp.tutor.home.title' },
        loadChildren: () => import('./tutor/tutor.module').then(m => m.TutorModule),
      },
      {
        path: 'convenio',
        data: { pageTitle: 'iPetApp.convenio.home.title' },
        loadChildren: () => import('./convenio/convenio.module').then(m => m.ConvenioModule),
      },
      {
        path: 'exame',
        data: { pageTitle: 'iPetApp.exame.home.title' },
        loadChildren: () => import('./exame/exame.module').then(m => m.ExameModule),
      },
      {
        path: 'remedios',
        data: { pageTitle: 'iPetApp.remedios.home.title' },
        loadChildren: () => import('./remedios/remedios.module').then(m => m.RemediosModule),
      },
      {
        path: 'consulta',
        data: { pageTitle: 'iPetApp.consulta.home.title' },
        loadChildren: () => import('./consulta/consulta.module').then(m => m.ConsultaModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
