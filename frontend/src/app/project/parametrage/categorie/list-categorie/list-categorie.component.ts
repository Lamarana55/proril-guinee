
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { ParametrageService } from '../../services/parametrage.service';
import { PERMISSIONS } from 'app/config/app.data';
import { Confirmable } from 'app/project/core/decorators/confirmable.decorator';
import { Categorie } from '../../models/categorie.model';
import { AuthService } from 'app/project/auth/services/auth.service';
import { UtilService } from 'app/project/core/services/util.service';

@Component({
  selector: 'app-list-categorie',
  templateUrl: './list-categorie.component.html',
  styleUrls: ['./list-categorie.component.css']
})
export class ListCategorieComponent implements OnInit {

  displayedColumns = ['libelle', 'description', 'action'];
  dataSource: MatTableDataSource<Categorie> = new MatTableDataSource(new Array<Categorie>());

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
    this.getcategorie();
  }

  async getcategorie() {
    this.isLoading = true;
    const data = await this.paramService.getAllCategories().toPromise().catch(() => new Array());
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
    this.router.navigate(['/parametrages/categories/edit', {id: id}]);
  }

  onRefresh() {
    this.dataSource.data = [];
    this.getcategorie();
  }

  @Confirmable({
    html: 'Voulez-vous supprimer cet categorie ?',
    icon: 'warning'
  })
  onDelete(categorie: Categorie) {
    this.paramService.deleteCategorie(categorie.id).subscribe(
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
      can_add: authPermissions.includes(PERMISSIONS.CAN_ADD_CATEGORIE),
      can_edit: authPermissions.includes(PERMISSIONS.CAN_UPDATE_CATEGORIE),
      can_delete: authPermissions.includes(PERMISSIONS.CAN_DELETE_CATEGORIE)
    }
  }
}
