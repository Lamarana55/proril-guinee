import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from "@angular/router";
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PERMISSIONS, STATUT_ALERTE } from 'app/config/app.data';
import { AuthService } from 'app/mgf/auth/services/auth.service';
import { Confirmable } from 'app/mgf/core/decorators/confirmable.decorator';
import { map, tap } from 'rxjs/operators';
import { DATE_FORMAT } from './../../../../config/app.data';
import { UtilService } from './../../../core/services/util.service';
import { Alerte } from './../../models/alerte.model';
import { ALERTE_URL, GestionCasService } from './../../services/gestion-cas.service';
import { RequestAlerteParam } from 'app/mgf/core/models/request-alerte-param';

declare interface AlerteDisplay {
  id: number
  typeCas: string
  msisdn: string
  statut: string
  commune: string
  gestionnaire: string
  date: string,
  code: string 
}

const mapper = (alerte: Alerte) => {
  return {
    id: alerte.id,
    typeCas: alerte.typeCas.libelle,
    msisdn: alerte.msisdn,
    statut: alerte.statut,
    commune: alerte.commune ? alerte.commune.nom : '',
    gestionnaire: alerte.user ? alerte.user.username : '--',
    date: alerte.createdAt,
    code: alerte.code
  } as AlerteDisplay
}

declare interface RequestParam {
  searchType ?: 'DATE' | 'DATE_BETWEEN' | 'STATUT'
  date?: string
  dateDebut?: string
  dateFin?: string
  statut?: string
  page?: number
  size?: number
}

@Component({
  selector: 'app-list-alerte',
  templateUrl: './list-alerte.component.html',
  styleUrls: ['./list-alerte.component.css']
})
export class ListAlerteComponent implements OnInit, AfterViewInit {

  displayedColumns = ['date', 'code', 'typeCas', 'msisdn', 'statut', 'commune', 'gestionnaire', 'action'];
  dataSource: MatTableDataSource<AlerteDisplay> = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  panelOpenState = false
  alerteStatut = STATUT_ALERTE;
  params: RequestParam;
  option: string;

  modalRef: NgbModalRef;
  idAlerte: number;
  readonly alerteUrl = ALERTE_URL

  permissions = {
    can_update: false,
    can_affecte: false,
    can_delete: false
  }

  pageSize = 10;
  currentPage = 0;
  totalRows=0;

  constructor(private gestCasService: GestionCasService,
              private auth: AuthService,
              private utils: UtilService,
              private datePipe: DatePipe,
              private modalService: NgbModal,
              private _activeRoute: ActivatedRoute,
              private cdrf: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.setPermissions();
    const now = this.datePipe.transform(new Date(), DATE_FORMAT);
    
    this.params = {
      searchType: 'STATUT',
      date: now,
      dateDebut: now,
      dateFin: now
    }
    this.iniData({page: this.currentPage, size: this.pageSize});

  }
  
  ngAfterContentChecked() {
    this.cdrf.detectChanges();
  }

  async iniData(params: RequestParam={page: this.currentPage, size: this.pageSize}) {
    const data = await this.gestCasService.getAllAlertes(params).pipe(
      tap(alerte => this.totalRows = alerte.totalItem),
      map(alerte => alerte.data.map(mapper)),
    ).toPromise();
    this.dataSource.data = data;
    //this.dataSource.data.push.apply(this.dataSource.data, data);
    
    setTimeout(() => {
      this.paginator.pageIndex = this.currentPage;
      this.paginator.length =  this.totalRows;
    })
  }

  /* onSearch() {
    this.dataSource.data = [];
    this.params.page = 0
    this.params.size = 10
  
    this.iniData(this.params);
  } */

  onSearch(params: RequestAlerteParam) {
    if (params) {
      params.page = 0;
      params.size = 10;

      this.iniData(params);
    }
  }


  onRefresh() {
    this.dataSource.data = [];
    this.iniData();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  @Confirmable({html: 'Voulez-vous changer le statut de cette alerte ?', title: 'Traitement'})
  onAlerteProcesse(alerte: AlerteDisplay) {
    this.gestCasService.treateAlerte(alerte.id).subscribe(
      updAlerte => {
        this.utils.showNotif('Action éffectuée avec succès', 'success');
        this.updateDatatableOneRow(updAlerte);
      },
      err => {
        this.utils.showNotif(`Une erreur est survenue lors de l'opération [${err}]`, 'danger')
      }
    )
  }

  @Confirmable({html: 'Voulez-vous supprimer cette alerte ?', icon: 'warning'})
  onDelete(alerte: AlerteDisplay) {
    this.gestCasService.deleteAlerte(alerte.id).subscribe(
      () => {
        this.utils.showNotif('Suppression effectuée avec succès', 'success')
        const index = this.dataSource.data.findIndex(al => al.id === alerte.id);
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
      },
      err => {
        this.utils.showNotif(`Une erreur est survenue lors de la suppression ${err}`, 'danger')
      }
    );
  }

   onOpenAffectModal(content: any, alerteId: number) {
    this.idAlerte = alerteId;
    this.modalRef = this.modalService.open(content, {backdrop: 'static', size: 'lg'})
   }

   onCloseModal(isDone: {done: boolean, alerte: Alerte}) {
     if (isDone.done) {
       this.modalRef.close();
       this.updateDatatableOneRow(isDone.alerte);
     }
   }

   updateDatatableOneRow(alerte: Alerte) {
    const index = this.dataSource.data.findIndex(al => al.id === alerte.id);
    this.dataSource.data[index] = mapper(alerte)
    this.dataSource._updateChangeSubscription();
   }

   ngAfterViewInit() {
     this.dataSource.paginator = this.paginator;
     this.dataSource.sort = this.sort;
   }

   setPermissions() {
     const authPermissions = this.auth.getPermissions();
     this.permissions = {
       can_update: authPermissions.includes(PERMISSIONS.CAN_UPDATE_ALERT),
       can_affecte: authPermissions.includes(PERMISSIONS.CAN_AFFECTE_ALERT_USER),
       can_delete: authPermissions.includes(PERMISSIONS.CAN_DELETE_ALERT)
     }
   }


   pageChanged(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.totalRows = event.length;

    this.params.page = this.currentPage
    this.params.size = this.pageSize
    this.iniData({page: this.currentPage, size: this.pageSize});
    /* if(this.params.statut !== null){
      this.iniData({page: this.currentPage, size: this.pageSize, searchType: 'STATUT', statut: this.params.statut});
    }else{
      this.iniData({page: this.currentPage, size: this.pageSize});
    } */

  }

}
