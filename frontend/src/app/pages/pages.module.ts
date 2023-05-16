import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { PagesRoutes } from "./pages.routing";

import { LockComponent } from "./lock/lock.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { SendmailResetComponent } from './sendmail-reset/sendmail-reset.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { MaterialModule } from "app/mgf/material/material.module";

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PagesRoutes),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [
    LoginComponent, 
    RegisterComponent, 
    LockComponent, 
    SendmailResetComponent, UpdatePasswordComponent],
})
export class PagesModule {}
