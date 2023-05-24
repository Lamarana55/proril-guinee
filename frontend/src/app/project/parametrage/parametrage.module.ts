import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from './../core/core.module';
import { MaterialModule } from './../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParametrageRoutingModule } from './parametrage-routing.module';
import { ParametrageComponent } from './parametrage.component';
import { EditQuestionComponent } from './question/edit-question/edit-question.component';
import { ListQuestionComponent } from './question/list-question/list-question.component';
import { EditTypeCasComponent } from './type-cas/edit-type-cas/edit-type-cas.component';
import { ListTypeCasComponent } from './type-cas/list-type-cas/list-type-cas.component';
import { EditCategorieComponent } from './categorie/edit-categorie/edit-categorie.component';
import { GroupementComponent } from './groupement/groupement/groupement.component';
import { EditGroupementComponent } from './groupement/edit-groupement/edit-groupement.component';
import { EditMarqueComponent } from './marque/edit-marque/edit-marque.component';
import { MarqueComponent } from './marque/marque/marque.component';
import { CategorieComponent } from './categorie/categorie/categorie.component';


@NgModule({
  declarations: [
    ParametrageComponent,
    EditQuestionComponent,
    ListQuestionComponent,
    EditTypeCasComponent,
    ListTypeCasComponent,
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
