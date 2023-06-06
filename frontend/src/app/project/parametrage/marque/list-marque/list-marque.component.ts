import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PERMISSIONS } from 'app/config/app.data';
import { AuthService } from 'app/project/auth/services/auth.service';
import { Confirmable } from 'app/project/core/decorators/confirmable.decorator';
import { RequestCasParam } from 'app/project/core/models/request-cas-param';
import { UtilService } from 'app/project/core/services/util.service';
import { BehaviorSubject, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Marque } from '../../models/marque.model';
import { MARQUE_URL, ParametrageService } from '../../services/parametrage.service';
import { RequestMarqueParam } from 'app/project/core/models/request.marque.model';
@Component({
  selector: 'app-list-marque',
  templateUrl: './list-marque.component.html',
  styleUrls: ['./list-marque.component.css']
})
export class ListMarqueComponent implements OnInit {
  
  marques$: Observable<Marque[]>;
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

  marqueUrl = MARQUE_URL;
  modalRef: NgbModalRef;
  reinitialisationForm: FormGroup;
  marqueId: number = 0;
  messageAttente: string = "";

  displayedColumns = [ 'marque', 'groupement', 'description',  'option'];
  dataSource: MatTableDataSource<Marque> = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private parametrageService: ParametrageService,
              private auth: AuthService,
              private utils: UtilService,
              private fb: FormBuilder,
              private modalService: NgbModal,
              private cdrf: ChangeDetectorRef) { }

/* ======================================== */

 async getElement(params: RequestMarqueParam = { page: this.currentPage, size: this.pageSize }){

  this.parametrageService.getAllMarques(params).subscribe( data => {
    const displayData = data.data.map(dd => {
      this.totalRows = data.totalItem;
      return {
        id: dd.id,
        libelle: dd.libelle,
        description: dd.description,
        groupement: dd.groupement,
      } as Marque

    
    }, error => {
      console.log("error: ", error)
    })
    this.dataSource.data = displayData
    setTimeout(() => {
      // this.paginator.pageIndex = this.currentPage;
      this.paginator.length = this.totalRows;
    });
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

    this.reinitialisationForm = this.fb.group({
      mode: ['', [Validators.required]],
    });
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
    this.parametrageService.deleteMarque(id).subscribe(
      () => {
        this.utils.showNotif('Utilisateur supprimé avec succès ', 'success');
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
      can_add: authPermissions.includes(PERMISSIONS.CAN_ADD_MARQUE),
      can_edit: authPermissions.includes(PERMISSIONS.CAN_UPDATE_MARQUE),
      can_delete: authPermissions.includes(PERMISSIONS.CAN_DELETE_MARQUE),
      can_view_info: authPermissions.includes(PERMISSIONS.CAN_DELETE_MARQUE)
    }
  }

 

  onCloseModal() {
    this.modalRef.close();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }
  
  onSearch(params: RequestCasParam) {
    
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
