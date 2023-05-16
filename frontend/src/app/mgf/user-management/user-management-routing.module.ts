import { SingleUserComponent } from './user/single-user/single-user.component';
import { EditRoleComponent } from './role/edit-role/edit-role.component';
import { ListRoleComponent } from './role/list-role/list-role.component';
import { EditUserComponent } from './user/edit-user/edit-user.component';
import { ListUserComponent } from './user/list-user/list-user.component';
import { UserManagementComponent } from './user-management.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PERMISSIONS } from 'app/config/app.data';
import { RoleGuard } from '../auth/services/role-guard.service';

const routes: Routes = [
  {
    path: '',
    component: UserManagementComponent,
    children: [
      {
        path: '',
        component: ListUserComponent,
        canActivate: [RoleGuard],
        data: {permissions: PERMISSIONS.CAN_VIEW_USERS_LIST},
      }, {
        path: 'edit',
        component: EditUserComponent,
        canActivate: [RoleGuard],
        data: {permissions: PERMISSIONS.CAN_ADD_USER},
      }, {
        path: 'info/:id',
        component: SingleUserComponent,
        canActivate: [RoleGuard],
        data: {permissions: PERMISSIONS.CAN_VIEW_USER_INFO},
      }, {
        path: 'roles',
        children: [
          {
            path: '',
            component: ListRoleComponent,
            canActivate: [RoleGuard],
            data: {permissions: PERMISSIONS.CAN_VIEW_ROLES_LIST},
          }, {
            path: 'edit',
            component: EditRoleComponent,
            canActivate: [RoleGuard],
            data: {permissions: PERMISSIONS.CAN_ADD_ROLE}
          }
        ]
      }/* , {
        path: 'permissions',
        children: [
          {
            path: '',
            component: ListPermissionComponent
          }, {
            path: 'edit',
            component: EditPermissionComponent
          }
        ]
      } */
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
