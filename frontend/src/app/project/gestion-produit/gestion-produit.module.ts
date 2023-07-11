import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { GestionProduitRoutingModule } from './gestion-produit-routing.module';
import { ListProduitComponent } from './produit/list-produit/list-produit.component';
import { EditProduitComponent } from './produit/edit-produit/edit-produit.component';
import { EditVenteComponent } from './ventes/edit-vente/edit-vente.component';
import { ListVenteComponent } from './ventes/list-vente/list-vente.component';
import { ListClientComponent } from './client/list-client/list-client.component';
import { EditClientComponent } from './client/edit-client/edit-client.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core/core.module';
import { MaterialModule } from '../material/material.module';
import { InfoProduitComponent } from './produit/info-produit/info-produit.component';
import { StatistiqueProduitComponent } from './statistique-produit/statistique-produit/statistique-produit.component';
import { GestionProduitComponent } from './gestion-produit.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SearhClientComponent } from './client/searh-client/searh-client.component';
import { SearchProduitComponent } from './produit/search-produit/search-produit.component';


@NgModule({
  declarations: [GestionProduitComponent, ListProduitComponent, EditProduitComponent, EditVenteComponent, ListVenteComponent, ListClientComponent, EditClientComponent, InfoProduitComponent, StatistiqueProduitComponent, SearhClientComponent, SearchProduitComponent, ],
  imports: [
    CommonModule,
    GestionProduitRoutingModule,
    NgbModule,
    FormsModule,
    CoreModule,
    MaterialModule,
    MatDialogModule,
    ReactiveFormsModule,
  ]
})
export class GestionProduitModule { }
