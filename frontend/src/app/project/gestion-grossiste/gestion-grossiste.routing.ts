
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from '../auth/services/role-guard.service';
import { GestionGrossisteComponent } from './gestion-grossiste.component';

const routes: Routes = [
  {
    path: '',
    component: GestionGrossisteComponent,
    children: [
      {
        path: '',
        redirectTo: 'grossistes',
        pathMatch: 'full'
      }, {
        path: 'grossistes',
        children: [
          {
            path: '',
            component: ,
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
export class GestionGrossisteRoutingModule { }
