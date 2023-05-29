
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from '../auth/services/role-guard.service';
import { GestionGrossisteComponent } from './gestion-grossiste.component';
import { ListGrossisteComponent } from './grossiste/list-grossiste/list-grossiste.component';
import { PERMISSIONS } from 'app/config/app.data';
import { EditGrossisteComponent } from './grossiste/edit-grossiste/edit-grossiste.component';
import { InfoGrossisteComponent } from './grossiste/info-grossiste/info-grossiste.component';
import { ListProduitComponent } from './produit/list-produit/list-produit.component';
import { EditProduitComponent } from '../gestion-produit/produit/edit-produit/edit-produit.component';

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
            component: ListGrossisteComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_VIEW_GROSSISTE_LIST}
          }, {
            path: 'edit',
            component: EditGrossisteComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_ADD_GROSSISTE}
          }, {
            path: 'info/:id',
            component: InfoGrossisteComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_VIEW_GROSSISTE_INFO}
          }
        ]
      }, 
      {
        path: 'produits',
        children: [
          {
            path: '',
            component: EditProduitComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_VIEW_PRODUIT_LIST}
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
export class GestionGrossisteRoutingModule { }
