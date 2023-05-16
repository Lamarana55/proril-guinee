import { Component, OnInit } from '@angular/core';
import { PERMISSIONS } from 'app/config/app.data';
import { AuthService } from '../auth/services/auth.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  permissions = {
    can_view_user_list: false,
    can_view_role_list: false
  }

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.setPermissions()
  }

  setPermissions() {
    const authPermissions = this.auth.getPermissions();
    this.permissions = {
      can_view_user_list: authPermissions.includes(PERMISSIONS.CAN_VIEW_USERS_LIST),
      can_view_role_list: authPermissions.includes(PERMISSIONS.CAN_VIEW_ROLES_LIST)
    }
  }

}
