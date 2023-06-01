import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from './../core/core.module';
import { MaterialModule } from './../material/material.module';

import { EditCategorieComponent } from './categorie/edit-categorie/edit-categorie.component';
import { EditGroupementComponent } from './groupement/edit-groupement/edit-groupement.component';
import { EditMarqueComponent } from './marque/edit-marque/edit-marque.component';
import { ParametrageRoutingModule } from './parametrage-routing.module';
import { ParametrageComponent } from './parametrage.component';
import { ListGroupementComponent } from './groupement/list-groupement/list-groupement.component';
import { ListCategorieComponent } from './categorie/list-categorie/list-categorie.component';
import { ListMarqueComponent } from './marque/list-marque/list-marque.component';


@NgModule({
  declarations: [
    ParametrageComponent,
    EditCategorieComponent,
    EditGroupementComponent,
    EditMarqueComponent,
    ListGroupementComponent,
    ListCategorieComponent,
    ListMarqueComponent
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
