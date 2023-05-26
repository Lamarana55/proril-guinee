
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleGuard } from '../auth/services/role-guard.service';
import { GestionProduitComponent } from './gestion-produit.component';
import { ListProduitComponent } from './produit/list-produit/list-produit.component';
import { PERMISSIONS } from 'app/config/app.data';
import { EditProduitComponent } from './produit/edit-produit/edit-produit.component';
import { InfoProduitComponent } from './produit/info-produit/info-produit.component';
import { ListClientComponent } from './client/list-client/list-client.component';
import { StatistiqueProduitComponent } from './statistique-produit/statistique-produit/statistique-produit.component';

const routes: Routes = [
  {
    path: '',
    component: GestionProduitComponent,
    children: [
      {
        path: '',
        redirectTo: 'produits',
        pathMatch: 'full'
      }, {
        path: 'produits',
        children: [
          {
            path: '',
            component: ListProduitComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_VIEW_PRODUIT_LIST}
          }, {
            path: 'edit',
            component: EditProduitComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_ADD_PRODUIT}
          }, {
            path: 'info/:id',
            component: InfoProduitComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_VIEW_PRODUIT_INFO}
          }
        ]
      }, {
        path: 'clients',
        children: [
          {
            path: '',
            component: ListClientComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_VIEW_CLIENT_LIST}
          },
          {
            path: 'edit',
            component: EditProduitComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_ADD_PRODUIT}
          },
        ]
      },{
        path: 'statistiques',
        children: [
          {
            path: '',
            component: StatistiqueProduitComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_VIEW_STATISTIQUE_LIST}
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
export class GestionProduitRoutingModule { }
