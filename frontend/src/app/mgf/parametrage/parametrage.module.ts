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
import { EditTypeAppuiComponent } from './type-appui/edit-type-appui/edit-type-appui.component';
import { ListTypeAppuiComponent } from './type-appui/list-type-appui/list-type-appui.component';
import { EditTypeCasComponent } from './type-cas/edit-type-cas/edit-type-cas.component';
import { ListTypeCasComponent } from './type-cas/list-type-cas/list-type-cas.component';
import { ListPartenaireComponent } from './partenaire/list-partenaire/list-partenaire.component';
import { EditPartenaireComponent } from './partenaire/edit-partenaire/edit-partenaire.component';


@NgModule({
  declarations: [
    ParametrageComponent,
    EditQuestionComponent,
    ListQuestionComponent,
    EditTypeAppuiComponent,
    ListTypeAppuiComponent,
    EditTypeCasComponent,
    ListTypeCasComponent,
    ListPartenaireComponent,
    EditPartenaireComponent
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
