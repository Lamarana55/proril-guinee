import { UtilService } from './../../../core/services/util.service';
import { ParametrageService, TYPE_CAS_URL } from './../../services/parametrage.service';
import { TypeCas } from './../../models/type-cas.model';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthService } from 'app/mgf/auth/services/auth.service';
import { Router } from '@angular/router';
import { PERMISSIONS } from 'app/config/app.data';
import { Confirmable } from 'app/mgf/core/decorators/confirmable.decorator';

@Component({
  selector: 'app-list-type-cas',
  templateUrl: './list-type-cas.component.html',
  styleUrls: ['./list-type-cas.component.css']
})
export class ListTypeCasComponent implements OnInit, AfterViewInit {

  displayedColumns = ['libelle', 'rapport', 'description', 'action'];
  dataSource: MatTableDataSource<TypeCas> = new MatTableDataSource(new Array<TypeCas>());

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  permissions = {
    can_add: false,
    can_edit: false,
    can_delete: false
  }

  typeCasUrl = TYPE_CAS_URL;

  constructor(private paramService: ParametrageService,
              private auth: AuthService,
              private router: Router,
              private utils: UtilService) { }

  ngOnInit() {
    this.setPermissions();
    this.getTypeCas();
  }

  async getTypeCas() {
    const data = await this.paramService.getAllTypeCas().toPromise().catch(() => new Array());
    this.dataSource.data.push.apply(this.dataSource.data, data);
    this.dataSource._updateChangeSubscription();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  gotoEdit(id: number) {
    this.router.navigate(['/parametrages/type-cas/edit', {id: id}]);
  }

  onRefresh() {
    this.dataSource.data = [];
    this.getTypeCas();
  }

  @Confirmable({html: 'Voulez-vous supprimer ce type de cas ?', icon: 'warning'})
  onDelete(id: number) {
    this.paramService.deleteTypeCas(id).subscribe(
      () => {
        this.utils.showNotif('Suppression effectuée avec succès', 'success')
        const index = this.dataSource.data.findIndex(dt => dt.id === id);
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
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
      can_add: authPermissions.includes(PERMISSIONS.CAN_ADD_TYPE_CAS),
      can_edit: authPermissions.includes(PERMISSIONS.CAN_UPDATE_TYPE_CAS),
      can_delete: authPermissions.includes(PERMISSIONS.CAN_DELETE_TYPE_CAS)
    }
  }

}
