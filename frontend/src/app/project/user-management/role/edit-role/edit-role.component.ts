import { UtilService } from './../../../core/services/util.service';
import { ROLE_URL } from './../../services/user.service';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Permission } from '../../models/permission.model';
import { UserService } from '../../services/user.service';
import { Role } from '../../models/role.model';
import { PERMISSIONS } from 'app/config/app.data';

declare interface PermissionForm {
  permission: Permission,
  value: boolean
  disable: boolean
}

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.css']
})
export class EditRoleComponent implements OnInit {

  isNew = true
  permissionForms = new Array<PermissionForm>();

  roleForm: FormGroup;
  roleId = 0;

  roleUrl = ROLE_URL;

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar,
              private router: Router,
              private utils: UtilService) { }

  ngOnInit(): void {
    this.roleId = this.route.snapshot.params['id'];
    this.isNew = isNaN(this.roleId);
    this.initPermissions();
    this.initForm();

    if (!this.isNew) {
      this.mapRole();
    }
  }

  initForm() {
    this.roleForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      description: ''
    })
  }

  resetForm() {
    this.initForm();
    this.roleForm.markAsUntouched();
    this.roleForm.markAsPristine();
    this.roleForm.updateValueAndValidity();
    this.initPermissions();
  }

  onSubmit() {
    if (this.roleForm.invalid) {
      const controls = this.roleForm.controls;
      Object.keys(controls).forEach(key => controls[key].markAsTouched())
      return;
    }

    const role  = this.roleForm.value as Partial<Role>;
    role.permissions = this.permissionForms.filter(form => form.value === true).map(form => form.permission)

    if (role.permissions.length === 0) {
      this.snackBar.open('Impossible d\'ajouter un role sans permission', '', {duration: 3000, verticalPosition: 'top', panelClass: ['my-snack-warning']})
      return;
    }

    const roleAction$ = this.isNew ? this.userService.addRole(role) : this.userService.updateRole(this.roleId, role);
    roleAction$.subscribe(
      () => {
        this.utils.showNotif('Operation effectuée avec succès', 'success');
        this.isNew ? this.resetForm() : this.router.navigate(['users/roles'])
      },
      err => {
        this.utils.showNotif(`Une erreur est survenue lors de l'opération \n ${err}`, 'danger')
      }
    )
  }

  async mapRole() {
    const role = await this.userService.getOneRole(this.roleId).toPromise();
    this.roleForm.patchValue({
      nom: role.nom,
      description: role.description
    })
    // console.log('before', this.permissionForms)

    this.initPermissions().then(() => {
      this.permissionForms = this.permissionForms.map(forms => ({
        permission: forms.permission,
        value: role.permissions.some(perm => perm.id === forms.permission.id),
        disable: forms.disable
      }));
    })

    // console.log('after', this.permissionForms)
  }

  async initPermissions() {
    const permissions = await this.userService.getAllPermission().toPromise();
    this.permissionForms = permissions.map(permission => {
      let value = false;
      let disable = false;

      if (permission.libelle === PERMISSIONS.CAN_VIEW_DASHBORD) {
        value = true;
        disable = true;
      }

      return {permission: permission, value: value, disable: disable}
    })
  }

}
