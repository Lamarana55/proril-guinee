import { EditPartenaireComponent } from './partenaire/edit-partenaire/edit-partenaire.component';
import { ListPartenaireComponent } from './partenaire/list-partenaire/list-partenaire.component';
import { PERMISSIONS } from 'app/config/app.data';
import { EditTypeCasComponent } from './type-cas/edit-type-cas/edit-type-cas.component';
import { ListTypeCasComponent } from './type-cas/list-type-cas/list-type-cas.component';
import { EditQuestionComponent } from './question/edit-question/edit-question.component';
import { ListQuestionComponent } from './question/list-question/list-question.component';
import { ParametrageComponent } from './parametrage.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from '../auth/services/role-guard.service';

const routes: Routes = [
  {
    path: '',
    component: ParametrageComponent,
    children: [
      {
        path: '',
        redirectTo: 'services',
        pathMatch: 'full'
      }, {
        path: 'services',
        children: [
          {
            path: '',
            component: ListQuestionComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_VIEW_QUESTION_LIST }
          }, {
            path: 'edit',
            component: EditQuestionComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_ADD_QUESTION }
          }
        ]
      }, {
        path: 'type-cas',
        children: [
          {
            path: '',
            component: ListTypeCasComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_VIEW_TYPE_CAS_LIST }
          }, {
            path: 'edit',
            component: EditTypeCasComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_ADD_TYPE_CAS }
          }
        ]
      }, {
        path: 'partenaires',
        children: [
          {
            path: '',
            component: ListPartenaireComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_VIEW_PARTENAIRE_LIST }
          }, {
            path: 'edit',
            component: EditPartenaireComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_ADD_PARTENAIRE }
          }
        ]
      }, /* {
        path: 'type-appuis',
        children: [
          {
            path: '',
            component: ListTypeAppuiComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_VIEW_TYPE_APPUI_LIST }
          }, {
            path: 'edit',
            component: EditTypeAppuiComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_ADD_TYPE_APPUI }
          }
        ]
      } */
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrageRoutingModule { }
