import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PERMISSIONS } from 'app/config/app.data';
import { AuthService } from 'app/project/auth/services/auth.service';
import { Confirmable } from 'app/project/core/decorators/confirmable.decorator';
import { RequestGroupementParam } from 'app/project/core/models/request-groupement.model';
import { UtilService } from 'app/project/core/services/util.service';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs-compat';
import { Groupement } from '../../models/Groupement.model';
import { GROUPEMENT_URL, ParametrageService } from '../../services/parametrage.service';

@Component({
  selector: 'app-list-groupement',
  templateUrl: './list-groupement.component.html',
  styleUrls: ['./list-groupement.component.css']
})
export class ListGroupementComponent implements OnInit {
   
  groupements$: Observable<Groupement[]>;
  subject = new BehaviorSubject(0);

  pageSize = 10;
  currentPage = 0;
  totalRows = 0;

  permissions = {
    can_add: false,
    can_edit: false,
    can_delete: false,
    can_view_info: false
  }

  groupementUrl = GROUPEMENT_URL;
  modalRef: NgbModalRef;
  reinitialisationForm: FormGroup;
  groupementId: number = 0;
  messageAttente: string = "";

  displayedColumns = [ 'nom','telephone', 'email', 'description', 'prefecture','commune', 'option'];
  dataSource: MatTableDataSource<Groupement> = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private parametrageService: ParametrageService,
              private auth: AuthService,
              private utils: UtilService,
              private fb: FormBuilder,
              private cdrf: ChangeDetectorRef) { }

/* ======================================== */

 async getElement(params: RequestGroupementParam = { page: this.currentPage, size: this.pageSize }){

  this.parametrageService.getAllGroupements(params).subscribe( data => {
    const displayData = data.data.map(groupement => {
      this.totalRows = data.totalItem;
      
      return {
        id: groupement.id,
        nom: groupement.nom,
        telephone: groupement.telephone,
        email: groupement.email,
        description: groupement.description,
        region: groupement.region,
        prefecture: groupement.prefecture,
        commune: groupement.commune,
        quartier: groupement.quartier
      } as Groupement

    
    }, error => {
      console.log("error: ", error)
    })
    this.dataSource.data = displayData
   /*  setTimeout(() => {
      this.paginator.pageIndex = this.currentPage;
      this.paginator.length = this.totalRows;
    }); */
    // this.dataSource.data.push.apply(this.dataSource.data, displayData);
    this.dataSource._updateChangeSubscription();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
  })
}


ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}

ngAfterContentChecked() {
  this.cdrf.detectChanges();
}
/* ======================================= */
  ngOnInit(): void {
    this.setPermissions()
    this.getElement()
  }
 
  onRefresh() {
    //this.subject.next(0);
    this.dataSource.data = [];
      this.getElement();
  }

  @Confirmable({
    html: 'Voulez-vous supprimer cet utilisateur ?',
    icon: 'warning'
  })
  onDelete(id: number) {
    this.parametrageService.deleteGroupement(id).subscribe(
      () => {
        this.utils.showNotif('Groupement supprimé avec succès ', 'success');
        this.onRefresh();
      },
      err => {
        this.utils.showNotif(`Une erreur est survenue lors de l'operation ${err}`, 'danger')
      }
    )
  }

  setPermissions() {
    const authPermissions = this.auth.getPermissions();
    this.permissions = {
      can_add: authPermissions.includes(PERMISSIONS.CAN_ADD_GROUPEMENT),
      can_edit: authPermissions.includes(PERMISSIONS.CAN_UPDATE_GROUPEMENT),
      can_delete: authPermissions.includes(PERMISSIONS.CAN_DELETE_GROUPEMENT),
      can_view_info: authPermissions.includes(PERMISSIONS.CAN_DELETE_GROUPEMENT)
    }
  }


  onCloseModal() {
    this.modalRef.close();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
    // console.log(this.dataSource.data)
  }
  
  onSearch(params: RequestGroupementParam) {
    
    if (params) {
      // this.dataSource.data = [];
      
      params.page = 0;
      params.size = 10;
      console.log("Params ",params)
      this.getElement(params);
    }
  }
  

  pageChanged(event: PageEvent) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.totalRows = event.length;
    this.getElement({ page: this.currentPage, size: this.pageSize });
  }
}