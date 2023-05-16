import { AuthService } from 'app/mgf/auth/services/auth.service';
import { switchMap, finalize, map } from 'rxjs/operators';
import { GestionCasService, REPONSE_URL } from './../../../services/gestion-cas.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, BehaviorSubject } from 'rxjs';
import { Component, Input, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Reponse } from 'app/mgf/gestion-cas/models/reponse.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PERMISSIONS } from 'app/config/app.data';

const REPONSE_TYPE = {
  OUI: 'Oui',
  NON: 'Non'
}
declare interface ResponseDisplay {
  id: number
  service: string
  reponse: string
  description: string
}

const mapper = (rep: Reponse) => {
  return {
    id: rep.id,
    service: rep.service.libelle,
    reponse: rep.reponse ? REPONSE_TYPE.OUI : REPONSE_TYPE.NON,
    description: rep.description
  } as ResponseDisplay
}

@Component({
  selector: 'app-list-reponse',
  templateUrl: './list-reponse.component.html',
  styleUrls: ['./list-reponse.component.css']
})
export class ListReponseComponent implements OnInit, AfterViewInit {

  @Input() casId: number
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns = ['service', 'reponse', 'description', 'action'];
  dataSource: MatTableDataSource<ResponseDisplay> = new MatTableDataSource([]);

  permissions = { can_edit: false };
  reponseId: number;
  modalRef: NgbModalRef;
  reponseUrl = REPONSE_URL;
  reponseType = REPONSE_TYPE;


  constructor(private gestCasService: GestionCasService,
              private auth: AuthService,
              private modalService: NgbModal, 
              private cdrf: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.setPermissions();
    this.initData();
  }

  async initData() {
    const data = await this.gestCasService.getAllReponses(this.casId).pipe(
      map(reponses => reponses.map(mapper) )
    ).toPromise();

    this.dataSource.data = [];
    this.dataSource.data.push.apply(this.dataSource.data, data);
    this.dataSource._updateChangeSubscription();
  }

  onOpenModal(content: any, reponseId: number) {
    this.reponseId = reponseId;
    this.modalRef = this.modalService.open(content, {backdrop: 'static'})
  }

  async onCloseModal(isDone = false) {
    if (isDone) {
      this.modalRef.close();
      const index = this.dataSource.data.findIndex(dt => dt.id === this.reponseId);
      this.dataSource.data[index] = await this.gestCasService.getOneReponse(this.reponseId).pipe(
        map(mapper)
      ).toPromise();
      this.dataSource._updateChangeSubscription();
    }
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  onRefresh() {
    this.initData();
  }

  ngAfterContentChecked() {
    this.cdrf.detectChanges();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  setPermissions() {
    const authPermissions = this.auth.getPermissions();
    this.permissions = {
      can_edit: authPermissions.includes(PERMISSIONS.CAN_UPDATE_CAS_RESPONSE)
    }
  }

}
