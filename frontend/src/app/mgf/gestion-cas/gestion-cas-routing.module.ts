import { StatistiqueCasComponent } from './statistique-cas/statistique-cas.component';
import { SurveillanceComponent } from './surveillance/surveillance.component';
import { PERMISSIONS } from 'app/config/app.data';
import { InfoCasComponent } from './cas/info-cas/info-cas.component';
import { EditVictimeComponent } from './victime/edit-victime/edit-victime.component';
import { ListVictimeComponent } from './victime/list-victime/list-victime.component';
import { ListAlerteComponent } from './alerte/list-alerte/list-alerte.component';
import { EditCasComponent } from './cas/edit-cas/edit-cas.component';
import { ListCasComponent } from './cas/list-cas/list-cas.component';
import { GestionCasComponent } from './gestion-cas.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from '../auth/services/role-guard.service';

const routes: Routes = [
  {
    path: '',
    component: GestionCasComponent,
    children: [
      {
        path: '',
        redirectTo: 'cas',
        pathMatch: 'full'
      }, {
        path: 'cas',
        children: [
          {
            path: '',
            component: ListCasComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_VIEW_CAS_LIST}
          }, {
            path: 'edit',
            component: EditCasComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_ADD_CAS}
          }, {
            path: 'info/:id',
            component: InfoCasComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_VIEW_CAS_INFO}
          }, {
            path: ':option',
            component: ListCasComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_VIEW_CAS_LIST}
          }
        ]
      }, {
        path: 'alertes',
        children: [
          {
            path: '',
            component: ListAlerteComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_VIEW_ALERT_LIST}
          },
          {
            path: ':option',
            component: ListAlerteComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_VIEW_ALERT_LIST}
          }
        ]
      }, {
        path: 'surveillances',
        children: [
          {
            path: '',
            component: SurveillanceComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_VIEW_SURVEILLANCE_LIST}
          }
        ]
      }, {
        path: 'statistiques',
        children: [
          {
            path: '',
            component: StatistiqueCasComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_VIEW_STATISTIQUE_LIST}
          }
        ]
      }, {
        path: 'victimes',
        children: [
          {
            path: '',
            component: ListVictimeComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_VIEW_VICTIME_LIST }
          }, {
            path: 'edit',
            component: EditVictimeComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_UPDATE_VICTIME }
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GestionCasRoutingModule { }
