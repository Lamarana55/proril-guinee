import { StatusCasFormatPipe } from './../core/pipes/status-cas-format.pipe';
import { FindLocalitePipe } from './../core/pipes/find-localite.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from './../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { GestionCasRoutingModule } from './gestion-cas-routing.module';
import { GestionCasComponent } from './gestion-cas.component';
import { ListAlerteComponent } from './alerte/list-alerte/list-alerte.component';
import { ListVictimeComponent } from './victime/list-victime/list-victime.component';
import { EditVictimeComponent } from './victime/edit-victime/edit-victime.component';
import { ListCasComponent } from './cas/list-cas/list-cas.component';
import { EditCasComponent } from './cas/edit-cas/edit-cas.component';
import { InfoCasComponent } from './cas/info-cas/info-cas.component';
import { EditReponseComponent } from './cas/reponse/edit-reponse/edit-reponse.component';
import { ListReponseComponent } from './cas/reponse/list-reponse/list-reponse.component';
import { EditTraitementComponent } from './cas/traitement/edit-traitement/edit-traitement.component';
import { ListTraitementComponent } from './cas/traitement/list-traitement/list-traitement.component';
import { MaterialModule } from '../material/material.module';
import { VictimeFormComponent } from './victime/edit-victime/victime-form/victime-form.component';
import { InfoVictimeComponent } from './victime/info-victime/info-victime.component';
import { AffectationComponent } from './alerte/affectation/affectation.component';
import { SurveillanceComponent } from './surveillance/surveillance.component';
import { StatistiqueCasComponent } from './statistique-cas/statistique-cas.component';
import { StatistiqueServicesComponent } from './statistique-cas/statistique-services/statistique-services.component';
import { StatistiqueTypeCasComponent } from './statistique-cas/statistique-type-cas/statistique-type-cas.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { SearchLocalComponent } from '../search-local/search-local.component';
import { SearchBarSurveillanceComponent } from './search-bar-surveillance/search-bar-surveillance.component';
import { SearchBarAlerteComponent } from './search-bar-alerte/search-bar-alerte.component';


@NgModule({
  declarations: [
    GestionCasComponent,
    ListAlerteComponent,
    ListVictimeComponent,
    EditVictimeComponent,
    ListCasComponent,
    EditCasComponent,
    InfoCasComponent,
    EditReponseComponent,
    ListReponseComponent,
    EditTraitementComponent,
    ListTraitementComponent,
    VictimeFormComponent,
    InfoVictimeComponent,
    AffectationComponent,
    SurveillanceComponent,
    StatistiqueCasComponent,
    StatistiqueServicesComponent,
    StatistiqueTypeCasComponent,
    SearchBarComponent,
    SearchBarSurveillanceComponent,
    SearchBarAlerteComponent,
    
  ],
  imports: [
    CommonModule,
    GestionCasRoutingModule,
    FormsModule,
    CoreModule,
    MaterialModule,
    ReactiveFormsModule 
  ],
  providers: [ DatePipe, FindLocalitePipe, StatusCasFormatPipe]
})
export class GestionCasModule { }
