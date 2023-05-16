import { TraitementCas } from './../../../models/traitement-cas.model';
import { PERMISSIONS } from 'app/config/app.data';
import { AuthService } from 'app/mgf/auth/services/auth.service';
import { UtilService } from './../../../../core/services/util.service';
import { map } from 'rxjs/operators';
import { GestionCasService, TRAITEMENT_CAS_URL } from './../../../services/gestion-cas.service';
import { Component, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Confirmable } from 'app/mgf/core/decorators/confirmable.decorator';

declare interface TraitementDisplay {
  id: number
  statut: string
  description: string
  username: string
  userId: number,
  date: string
}

const compare = (a: TraitementDisplay, b: TraitementDisplay) => {
  const ad = new Date(a.date);
  const bd = new Date(b.date);
  return bd.getTime() - ad.getTime();
}

const mapper = (traitement: TraitementCas) => {
  return {
    id: traitement.id,
    statut: traitement.statutCas,
    description: traitement.description,
    username: traitement.user.username,
    userId: traitement.user.id,
    date: traitement.createdAt
  } as TraitementDisplay
}

@Component({
  selector: 'app-list-traitement',
  templateUrl: './list-traitement.component.html',
  styleUrls: ['./list-traitement.component.css']
})
export class ListTraitementComponent implements OnInit, AfterViewInit {

  @Input() casId: number;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns: string[] = ['date', 'statut', 'description', 'username', 'action'];
  dataSource = new MatTableDataSource<TraitementDisplay>([]);

  permissions = {
    can_delete: false
  };

  traimentUrl = TRAITEMENT_CAS_URL;

  constructor(private gestCasService: GestionCasService,
              private utils: UtilService,
              private auth: AuthService) { }

  ngOnInit(): void {
    this.setPermissions();
    this.initData();
  }

  async initData() {
    const data = await this.gestCasService.getAllTraitements(this.casId).pipe(
      map(traitements => traitements.map(mapper).sort(compare))
    ).toPromise();

    this.dataSource.data = [];
    this.dataSource.data.push.apply(this.dataSource.data, data);
    this.dataSource._updateChangeSubscription();
  }

  @Confirmable({html: 'Voulez-vous effectuer cette suppression ?', icon: 'warning'})
  onDelete(id: number) {
    this.gestCasService.deleteTraitement(id).subscribe(
      () => {
        this.utils.showNotif('Suppression effectuée avec succès', 'success');
        const index  = this.dataSource.data.findIndex(dt => dt.id === id);
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
      },
      err => {
        this.utils.showNotif(`Une erreur est survenue lors l'opération ${err}`, 'danger');
      }
    )
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  setPermissions() {
    const authPermissions = this.auth.getPermissions();
    this.permissions = {
      can_delete: authPermissions.includes(PERMISSIONS.CAN_DELETE_CAS_TRAITEMENT)
    }
  }

}
