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
import { User } from '../../models/user.model';
import { USER_URL, UserService } from '../../services/user.service';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit {
   
  users$: Observable<User[]>;
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

  userUrl = USER_URL;
  modalRef: NgbModalRef;
  reinitialisationForm: FormGroup;
  userId: number = 0;
  messageAttente: string = "";

  displayedColumns = [ 'nom_prenom', 'email', 'telephone', 'role','statut',  'option'];
  dataSource: MatTableDataSource<User> = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private userService: UserService,
              private auth: AuthService,
              private utils: UtilService,
              private fb: FormBuilder,
              private modalService: NgbModal,
              private cdrf: ChangeDetectorRef) { }

/* ======================================== */

 async getElement(params: RequestCasParam= { page: this.currentPage, size: this.pageSize }){

  this.userService.getAll(params).subscribe( data => {
    const displayData = data.data.map(dd => {
      this.totalRows = data.totalItem;
      
      return {
        id: dd.id,
        nom: dd.nom,
        prenom: dd.prenom,
        email: dd.email,
        localite: dd.localite,
        telephone: dd.telephone,
        username: dd.username,
        password: dd.password,
        statut: dd.statut,
        role: dd.role,
        fonction: dd.fonction 
      } as User

    
    }, error => {
      console.log("error: ", error)
    })
    this.dataSource.data = displayData
    setTimeout(() => {
      this.paginator.pageIndex = this.currentPage;
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
    this.userService.delete(id).subscribe(
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
      can_add: authPermissions.includes(PERMISSIONS.CAN_ADD_USER),
      can_edit: authPermissions.includes(PERMISSIONS.CAN_UPDATE_USER),
      can_delete: authPermissions.includes(PERMISSIONS.CAN_DELETE_USER),
      can_view_info: authPermissions.includes(PERMISSIONS.CAN_DELETE_USER)
    }
  }

  onChangeStatus(idUser: number) {
    this.userService.changeStatus(idUser).subscribe(() => this.subject.next(0));
  }

  openModalReinitialisationPassword(content: any, user: User) {
    this.userId = user.id;
    this.modalRef = this.modalService.open(content, {backdrop: 'static'})
  }

  async onReinitialisationPassword() {
    this.messageAttente = "Veillez patienter pendant la génération du nouveau mot de passe";
    var data = {
      idUser: this.userId,
      option: this.reinitialisationForm.value.mode
    }
    
    this.userService.reinitialisationPassword(data).subscribe((reponse) => {
      this.messageAttente = "";
      this.onCloseModal();
      var statut = reponse.status;
      return Swal.fire({
        title: "Réinitialisation mot de passe",
        icon: statut ? 'success' : 'error',
        text: statut ? "Le mot de passe a été réinitialié avec succès" : "Une erreur s'est produite",
        showConfirmButton: true
      })
    })

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
  
  onSearch(params: RequestCasParam) {
    
    if (params) {
      // this.dataSource.data = [];
      
      params.page = 0;
      params.size = 10;
      console.log("Params ",params)
      this.getElement(params);
    }
  }
  async iniData(params: RequestCasParam = { page: this.currentPage, size: this.pageSize }) {
    /* const data = await this.userService.getAll(params).pipe(
      tap((user) => (this.totalRows = user.totalItem)),
      map((user) => user.data.map(mapper))
    ).toPromise(); */
    // this.dataSource.data = data;
  }

  pageChanged(event: PageEvent) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.totalRows = event.length;
    this.getElement({ page: this.currentPage, size: this.pageSize });
  }
}
