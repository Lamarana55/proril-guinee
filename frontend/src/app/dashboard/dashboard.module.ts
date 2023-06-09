import { StatusAlerteFormatPipe } from './../project/core/pipes/status-alerte-format.pipe';
import { StatusCasFormatPipe } from './../project/core/pipes/status-cas-format.pipe';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AgmCoreModule
} from '@agm/core';
import { DashboardComponent } from './dashboard.component';

import { DashboardRoutes } from './dashboard.routing';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DashboardRoutes),
        FormsModule,
        AgmCoreModule.forRoot({
          apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
        })
    ],
    declarations: [DashboardComponent],
    providers: [StatusCasFormatPipe, StatusAlerteFormatPipe],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class DashboardModule {}
