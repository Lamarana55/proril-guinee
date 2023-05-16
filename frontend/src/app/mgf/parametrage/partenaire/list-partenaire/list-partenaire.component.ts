import { ParametrageService, PARTENAIRE_URL } from './../../services/parametrage.service';
import { Partenaire } from './../../models/partenaire.model';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthService } from 'app/mgf/auth/services/auth.service';
import { Router } from '@angular/router';
import { UtilService } from 'app/mgf/core/services/util.service';
import { PERMISSIONS } from 'app/config/app.data';
import { Confirmable } from 'app/mgf/core/decorators/confirmable.decorator';

@Component({
  selector: 'app-list-partenaire',
  templateUrl: './list-partenaire.component.html',
  styleUrls: ['./list-partenaire.component.css']
})
export class ListPartenaireComponent implements OnInit, AfterViewInit {

  displayedColumns = ['nom', 'sigle', 'description', 'action'];
  dataSource: MatTableDataSource<Partenaire> = new MatTableDataSource(new Array<Partenaire>());

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  permissions = {
    can_add: false,
    can_edit: false,
    can_delete: false
  }

  partenaireUrl = PARTENAIRE_URL;

  constructor(private paramService: ParametrageService,
              private auth: AuthService,
              private router: Router,
              private utils: UtilService) { }

  ngOnInit() {
    this.setPermissions();
    this.getPartenaires();
  }

  async getPartenaires() {
    const data = await this.paramService.getAllPartenaires().toPromise();
    this.dataSource.data.push.apply(this.dataSource.data, data);
    this.dataSource._updateChangeSubscription();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  gotoEdit(id: number) {
    this.router.navigate(['/parametrages/partenaires/edit', {id: id}]);
  }

  onRefresh() {
    this.dataSource.data = [];
    this.getPartenaires();
  }

  @Confirmable({html: 'Voulez-vous supprimer ce partenaire ?', icon: 'warning'})
  onDelete(id: number) {
    this.paramService.deletePartenaire(id).subscribe(
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
      can_add: authPermissions.includes(PERMISSIONS.CAN_ADD_PARTENAIRE),
      can_edit: authPermissions.includes(PERMISSIONS.CAN_UPDATE_PARTENAIRE),
      can_delete: authPermissions.includes(PERMISSIONS.CAN_DELETE_PARTENAIRE)
    }
  }

}
