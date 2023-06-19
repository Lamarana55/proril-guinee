import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PERMISSIONS } from 'app/config/app.data';
import { AuthService } from 'app/project/auth/services/auth.service';
import { Confirmable } from 'app/project/core/decorators/confirmable.decorator';
import { UtilService } from 'app/project/core/services/util.service';
import { BehaviorSubject, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { CLIENT_URL, GestionProduitService } from '../../services/gestion-produit.service';
import { Client } from '../../models/client.model';
import { RequestClientParam } from '../../models/request-client-param';


@Component({
  selector: 'app-list-client',
  templateUrl: './list-client.component.html',
  styleUrls: ['./list-client.component.css']
})
export class ListClientComponent implements OnInit {
 
  clients$: Observable<Client[]>;
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

  clientUrl = CLIENT_URL;
  modalRef: NgbModalRef;
  clientId: number = 0;
  messageAttente: string = "";

  displayedColumns = [ 'nom', 'prenom', 'telephone', 'adresse',  'option'];
  dataSource: MatTableDataSource<Client> = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private gestionProduitService: GestionProduitService,
              private auth: AuthService,
              private utils: UtilService,
              private fb: FormBuilder,
              private modalService: NgbModal,
              private cdrf: ChangeDetectorRef) { }

/* ======================================== */

 async getElement(params: RequestClientParam = { page: this.currentPage, size: this.pageSize }){

  this.gestionProduitService.getAllClients(params).subscribe( data => {
    const displayData = data.data.map(dd => {
      this.totalRows = data.totalItem;
      
      return {
        id: dd.id,
        nom: dd.nom,
        prenom: dd.prenom,
        telephone: dd.telephone,
        adresse: dd.adresse
      } as Client

    
    }, error => {
      console.log("error: ", error)
    })
    this.dataSource.data = displayData
    setTimeout(() => {
      // this.paginator.pageIndex = this.currentPage;
      // this.paginator.length = this.totalRows;
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
  }
 
  onRefresh() {
    //this.subject.next(0);
    this.dataSource.data = [];
      this.getElement();
  }

  @Confirmable({
    html: 'Voulez-vous supprimer cet client ?',
    icon: 'warning'
  })
  onDelete(id: number) {
    this.gestionProduitService.deleteClient(id).subscribe(
      () => {
        this.utils.showNotif('Client supprimé avec succès ', 'success');
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
      can_add: authPermissions.includes(PERMISSIONS.CAN_ADD_CLIENT),
      can_edit: authPermissions.includes(PERMISSIONS.CAN_UPDATE_CLIENT),
      can_delete: authPermissions.includes(PERMISSIONS.CAN_DELETE_CLIENT),
      can_view_info: authPermissions.includes(PERMISSIONS.CAN_DELETE_CLIENT)
    }
  }


  openModalReinitialisationPassword(content: any, Client: Client) {
    this.clientId = Client.id;
    this.modalRef = this.modalService.open(content, {backdrop: 'static'})
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
  
  onSearch(params: RequestClientParam) {
    
    if (params) {
      // this.dataSource.data = [];
      
      params.page = 0;
      params.size = 10;
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
