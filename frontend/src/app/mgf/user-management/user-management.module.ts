import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserManagementRoutingModule } from './user-management-routing.module';
import { EditUserComponent } from './user/edit-user/edit-user.component';
import { ListUserComponent } from './user/list-user/list-user.component';
import { ListRoleComponent } from './role/list-role/list-role.component';
import { EditRoleComponent } from './role/edit-role/edit-role.component';
import { EditPermissionComponent } from './permission/edit-permission/edit-permission.component';
import { ListPermissionComponent } from './permission/list-permission/list-permission.component';
import { SingleUserComponent } from './user/single-user/single-user.component';
import { UserManagementComponent } from './user-management.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from '../core/core.module';
import { MaterialModule } from '../material/material.module';
import { SearchLocalComponent } from '../search-local/search-local.component';


@NgModule({
  declarations: [
    EditUserComponent,
    ListUserComponent,
    ListRoleComponent,
    EditRoleComponent,
    EditPermissionComponent,
    ListPermissionComponent,
    SingleUserComponent,
    UserManagementComponent,
    SearchLocalComponent
  ],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    CoreModule,
    NgbModule
  ]
})
export class UserManagementModule { }
