import { UtilService } from 'app/project/core/services/util.service';
import { ROLE_URL } from './../../services/user.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PERMISSIONS } from 'app/config/app.data';
import { AuthService } from 'app/project/auth/services/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Role } from '../../models/role.model';
import { UserService } from '../../services/user.service';
import { Confirmable } from 'app/project/core/decorators/confirmable.decorator';

declare var $: any;

@Component({
  selector: 'app-list-role',
  templateUrl: './list-role.component.html',
  styleUrls: ['./list-role.component.css']
})
export class ListRoleComponent implements OnInit, AfterViewInit {

  roles$: Observable<Role[]>;
  subject = new BehaviorSubject(0);

  page = 1;
  pageSize = 5;

  permissions = {
    can_add: false,
    can_edit: false,
    can_delete: false
  }

  roleUrl = ROLE_URL;

  constructor(private userService: UserService,
              private auth: AuthService,
              private utils: UtilService) { }

  ngOnInit(): void {
    this.setPermissions()

    this.roles$ = this.subject.asObservable().pipe(
      switchMap(() => this.userService.getAllRoles())
    );
  }

  onRefresh() {
    this.subject.next(0);
  }

  @Confirmable({
    html: 'Voulez-vous supprimer ce role ? <br>Les utilisateur ayant ce role auront un role par defaut',
    icon: 'warning'
  })
  onDelete(id: number) {
    this.userService.deleteRole(id).subscribe(
      () => {
        this.utils.showNotif('Role supprimé avec succès', 'success');
        this.onRefresh();
      },
      err => {
        this.utils.showNotif(`Une erreur est survenue lors de l'operation ${err}`, 'danger')
      }
    )
  }

  ngAfterViewInit() {
    $(function () {
      $('[data-toggle="popover"]').popover()
    })
  }

  setPermissions() {
    const authPermissions = this.auth.getPermissions();
    this.permissions = {
      can_add: authPermissions.includes(PERMISSIONS.CAN_ADD_ROLE),
      can_edit: authPermissions.includes(PERMISSIONS.CAN_UPDATE_ROLE),
      can_delete: authPermissions.includes(PERMISSIONS.CAN_DELETE_ROLE)
    }
  }

}
