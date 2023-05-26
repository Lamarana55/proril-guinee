import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from './../core/core.module';
import { MaterialModule } from './../material/material.module';

import { CategorieComponent } from './categorie/categorie/categorie.component';
import { EditCategorieComponent } from './categorie/edit-categorie/edit-categorie.component';
import { EditGroupementComponent } from './groupement/edit-groupement/edit-groupement.component';
import { GroupementComponent } from './groupement/groupement/groupement.component';
import { EditMarqueComponent } from './marque/edit-marque/edit-marque.component';
import { MarqueComponent } from './marque/marque/marque.component';
import { ParametrageRoutingModule } from './parametrage-routing.module';
import { ParametrageComponent } from './parametrage.component';


@NgModule({
  declarations: [
    ParametrageComponent,
    CategorieComponent,
    EditCategorieComponent,
    GroupementComponent,
    EditGroupementComponent,
    EditMarqueComponent,
    MarqueComponent
  ],
  imports: [
    CommonModule,
    ParametrageRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    CoreModule,
    FormsModule,
    NgbModule
  ]
})
export class ParametrageModule { }
