import { GestionCasService, VICTIME_URL } from './../../services/gestion-cas.service';
import { Victime } from './../../models/victime.model';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { UtilService } from 'app/mgf/core/services/util.service';
import { AuthService } from 'app/mgf/auth/services/auth.service';
import { PERMISSIONS } from 'app/config/app.data';
import { Confirmable } from 'app/mgf/core/decorators/confirmable.decorator';
import { RequestParamPagination } from 'app/mgf/utils/resquest.pagination';
import { tap, map } from 'rxjs/operators';

declare interface VictimeDisplay{
  id: number
  nom: string
  prenom: string
  age: number
  sexe: string
  adresse: string
  contactTuteur: string
  handicap: string
  photo: any
}

const mapper = (victime: Victime) => {
 return {
  id: victime.id,
  nom: victime.nom,
  prenom: victime.prenom,
  age: victime.age,
  sexe: victime.sexe,
  adresse: victime.adresse ? victime.adresse: '',
  contactTuteur: victime.contactTuteur ? victime.contactTuteur : '',
  handicap: victime.handicap,
  photo: victime.photo
 } as VictimeDisplay
} 

@Component({
  selector: 'app-list-victime',
  templateUrl: './list-victime.component.html',
  styleUrls: ['./list-victime.component.css']
})
export class ListVictimeComponent implements OnInit, AfterViewInit {

  displayedColumns = ['nom', 'prenom', 'sexe', 'contactTuteur','adresse', 'action'];
  dataSource: MatTableDataSource<VictimeDisplay> = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  params: RequestParamPagination;

  permissions = {
    can_add: false,
    can_edit: false,
    can_delete: false
  }
  
  victimeUrl = VICTIME_URL;

  pageSize = 10;
  currentPage = 0;
  totalRows=0;

  constructor(private gestCasService: GestionCasService,
              private auth: AuthService,
              private router: Router,
              private utils: UtilService) { }

  ngOnInit() {
    this.setPermissions();
    this.iniData();
  }

  async iniData(params: RequestParamPagination={page: this.currentPage, size: this.pageSize}) {

    const data = await this.gestCasService.getAllVictimes(params).pipe(
      tap((victimes) => this.totalRows = victimes.totalItem),
      map((victimes) => victimes.data.map(mapper))
    ).toPromise();
    console.log("test data ", data); 
    // this.dataSource.data = data;

    // const data = await this.gestCasService.getAllVictimes(params).toPromise().catch(() => [] as Victime[]);
    this.dataSource.data.push.apply(this.dataSource.data, data);
    this.dataSource._updateChangeSubscription();
    setTimeout(() => {
      this.paginator.pageIndex = this.currentPage;
      this.paginator.length = this.totalRows;
    });

  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    
    this.dataSource.filter = filterValue;
  }

  gotoEdit(id: number) {
    this.router.navigate(['/gestion-cas/victimes/edit', {id: id}]);
  }

  onRefresh() {
    this.dataSource.data = [];
    this.iniData();
  }

  @Confirmable({html: 'Voulez-vous supprimer cette victime ?', icon: 'warning'})
  onDelete(id: number) {
    this.gestCasService.deleteVictime(id).subscribe(
      () => {
        this.utils.showNotif('Suppression effectuée avec succès', 'success')
        const index = this.dataSource.data.findIndex(v => v.id === id);
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
      can_add: false, // authPermissions.includes(PERMISSIONS.CAN_ADD_ACTIVITY_AREA),
      can_edit:  authPermissions.includes(PERMISSIONS.CAN_UPDATE_VICTIME),
      can_delete: authPermissions.includes(PERMISSIONS.CAN_DELETE_VICTIME)
    }
  }

  pageChanged(event: PageEvent) {
    console.log("event: ", event)
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.totalRows = event.length;
    this.iniData({page: this.currentPage, size: this.pageSize});
  }

}
