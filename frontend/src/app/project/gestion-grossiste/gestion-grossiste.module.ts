import { CommonModule, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CoreModule } from "../core/core.module";
import { MaterialModule } from "../material/material.module";
import { GestionGrossisteComponent } from "./gestion-grossiste.component";
import { ListGrossisteComponent } from './grossiste/list-grossiste/list-grossiste.component';
import { ListProduitComponent } from './produit/list-produit/list-produit.component';
import { GestionGrossisteRoutingModule } from "./gestion-grossiste.routing";
import { InfoGrossisteComponent } from './grossiste/info-grossiste/info-grossiste.component';

@NgModule({
  declarations: [GestionGrossisteComponent, ListGrossisteComponent, ListProduitComponent, InfoGrossisteComponent,],
  imports: [
    CommonModule,
    GestionGrossisteRoutingModule,
    FormsModule,
    CoreModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  providers: [DatePipe],
})
export class GestionGrossisteModule {}
