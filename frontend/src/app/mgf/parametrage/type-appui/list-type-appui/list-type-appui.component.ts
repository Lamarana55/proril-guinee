import { TypeAppui } from './../../models/type-appui.model';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { UtilService } from 'app/mgf/core/services/util.service';
import { ParametrageService } from '../../services/parametrage.service';
import { AuthService } from 'app/mgf/auth/services/auth.service';
import { PERMISSIONS } from 'app/config/app.data';
import { Confirmable } from 'app/mgf/core/decorators/confirmable.decorator';

@Component({
  selector: 'app-list-type-appui',
  templateUrl: './list-type-appui.component.html',
  styleUrls: ['./list-type-appui.component.css']
})
export class ListTypeAppuiComponent implements OnInit, AfterViewInit {

  displayedColumns = ['libelle', 'description', 'action'];
  dataSource: MatTableDataSource<TypeAppui> = new MatTableDataSource(new Array<TypeAppui>());

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  permissions = {
    can_add: false,
    can_edit: false,
    can_delete: false
  }

  isLoading = false;

  constructor(private paramService: ParametrageService,
              private auth: AuthService,
              private router: Router,
              private utils: UtilService) { }

  ngOnInit() {
    this.setPermissions();
    this.getTypeAppui();
  }

  async getTypeAppui() {
    this.isLoading = true;
    const data = await this.paramService.getAllTypeAppui().toPromise().catch(() => new Array());
    this.isLoading = false;
    this.dataSource.data.push.apply(this.dataSource.data, data);
    this.dataSource._updateChangeSubscription();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  gotoEdit(id: number) {
    this.router.navigate(['/parametrages/type-appuis/edit', {id: id}]);
  }

  onRefresh() {
    this.dataSource.data = [];
    this.getTypeAppui();
  }

  @Confirmable({
    html: 'Voulez-vous supprimer ce type d\'appui ?',
    icon: 'warning'
  })
  onDelete(typeAppui: TypeAppui) {
    this.paramService.deleteTypeAppui(typeAppui.id).subscribe(
      () => {
        this.utils.showNotif('Suppression effectuée avec succès', 'success')
        this.onRefresh();
      },
      err => {
        this.utils.showNotif(`Une erreur est survenue lors de la suppression ${err}`, 'danger')
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  setPermissions() {
    const authPermissions = this.auth.getPermissions();
    this.permissions = {
      can_add: authPermissions.includes(PERMISSIONS.CAN_ADD_TYPE_APPUI),
      can_edit: authPermissions.includes(PERMISSIONS.CAN_UPDATE_TYPE_APPUI),
      can_delete: authPermissions.includes(PERMISSIONS.CAN_DELETE_TYPE_APPUI)
    }
  }

}
