import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PERMISSIONS } from 'app/config/app.data';
import { RoleGuard } from '../auth/services/role-guard.service';
import { ParametrageComponent } from './parametrage.component';
import { EditCategorieComponent } from './categorie/edit-categorie/edit-categorie.component';
import { EditGroupementComponent } from './groupement/edit-groupement/edit-groupement.component';
import { EditMarqueComponent } from './marque/edit-marque/edit-marque.component';
import { ListGroupementComponent } from './groupement/list-groupement/list-groupement.component';
import { ListMarqueComponent } from './marque/list-marque/list-marque.component';
import { ListCategorieComponent } from './categorie/list-categorie/list-categorie.component';

const routes: Routes = [
  {
    path: '',
    component: ParametrageComponent,
    children: [
      {
        path: '',
        redirectTo: 'categories',
        pathMatch: 'full'
      }, 
      {
        path: 'categories',
        children: [
          {
            path: '',
            component: ListCategorieComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_VIEW_CATEGORIE_LIST }
          }, {
            path: 'edit',
            component: EditCategorieComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_ADD_CATEGORIE }
          }
        ]
      }, 
      {
        path: 'groupements',
        children: [
          {
            path: '',
            component: ListGroupementComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_VIEW_GROUPEMENT_LIST }
          }, {
            path: 'edit',
            component: EditGroupementComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_ADD_GROUPEMENT }
          }
        ]
      },
      {
        path: 'marques',
        children: [
          {
            path: '',
            component: ListMarqueComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_VIEW_MARQUE_LIST }
          }, {
            path: 'edit',
            component: EditMarqueComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_ADD_MARQUE }
          }
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrageRoutingModule { }
