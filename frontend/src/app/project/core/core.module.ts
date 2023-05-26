import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FindLocalitePipe } from './pipes/find-localite.pipe';
import { TableOptionsPipe } from './pipes/table-options.pipe';
import { QuartierComponent } from './shared/quartier/quartier.component';
import { SecteurComponent } from './shared/secteur/secteur.component';
import { UpdatePasswordComponent } from './shared/update-password/update-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';
import { PipeFunctionPipe } from './pipes/pipe-function.pipe';
import { DisplayLocaliteComponent } from './shared/display-localite/display-localite.component';
import { StatusCasFormatPipe } from './pipes/status-cas-format.pipe';
import { StatusAlerteFormatPipe } from './pipes/status-alerte-format.pipe';
import { SpinnerComponent } from './shared/spinner/spinner.component';



@NgModule({
  declarations: [
    FindLocalitePipe,
    TableOptionsPipe,
    QuartierComponent,
    SecteurComponent,
    UpdatePasswordComponent,
    PipeFunctionPipe,
    DisplayLocaliteComponent,
    StatusCasFormatPipe,
    StatusAlerteFormatPipe,
    SpinnerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    QuartierComponent,
    SecteurComponent,
    UpdatePasswordComponent,
    FindLocalitePipe,
    TableOptionsPipe,
    PipeFunctionPipe,
    DisplayLocaliteComponent,
    StatusCasFormatPipe,
    StatusAlerteFormatPipe,
    SpinnerComponent
  ]
})
export class CoreModule { }
