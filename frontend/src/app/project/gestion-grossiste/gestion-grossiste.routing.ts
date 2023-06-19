
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PERMISSIONS } from 'app/config/app.data';
import { RoleGuard } from '../auth/services/role-guard.service';
import { GestionGrossisteComponent } from './gestion-grossiste.component';
import { InfoGrossisteComponent } from './grossiste/info-grossiste/info-grossiste.component';
import { ListGrossisteComponent } from './grossiste/list-grossiste/list-grossiste.component';
import { ListProduitComponent } from './produit/list-produit/list-produit.component';

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
            component: ListProduitComponent,
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
