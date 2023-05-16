import { DatePipe } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LOCALITE, PERMISSIONS } from 'app/config/app.data';
import { AuthService } from 'app/mgf/auth/services/auth.service';
import { Confirmable } from 'app/mgf/core/decorators/confirmable.decorator';
import { Localite } from 'app/mgf/core/models/localite.model';
import { Secteur } from 'app/mgf/core/models/secteur.model';
import { UtilService } from 'app/mgf/core/services/util.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Mois } from '../models/mois.model';
import { FindLocalitePipe } from './../../core/pipes/find-localite.pipe';
import { RapportSurveillance } from './../models/rapport-surveillance.model';
import { RequestSurveillanceParam, SURVEILLANCE_URL, SurveillanceService } from './../services/surveillance.service';
import { TypeCas } from 'app/mgf/parametrage/models/type-cas.model';

declare interface RapportDisplay {
  id: number
  // annee: number
  date: string,
  mois: string
  typeCas: string
  casAvere: number
  casEmpeche: number
  surveillant: string
  userId?: number
  secteur?: number
  quartier?: number
  commune?: number
  prefecture?: number
  region?: number
}

const getLocalite = (localite: Localite) => {
  if (localite.idSecteur) {
    return { id: localite.idSecteur, type: LOCALITE.SECTEUR };
  } else if (localite.idQuartier) {
    return { id: localite.idQuartier, type: LOCALITE.QUARTIER };
  } else if (localite.idCommune) {
    return { id: localite.idCommune, type: LOCALITE.COMMUNE };
  } else if (localite.idPrefecture) {
    return { id: localite.idPrefecture, type: LOCALITE.PREFECTURE };
  } else {
    return { id: localite.idRegion, type: LOCALITE.REGION };
  }
}

// annee: rapport.annee,
const mapper = (rapport: RapportSurveillance) => {
  return {
    id: rapport.id,
    date: rapport.createdAt,
    mois: rapport.mois.libelle,
    typeCas: rapport.typeCas.libelle,
    casAvere: rapport.casAverer,
    casEmpeche: rapport.casEmpecher,
    surveillant: rapport.user.username,
    userId: rapport.user.id,
    secteur: rapport.user.localite.idSecteur,
    quartier: rapport.user.localite.idQuartier,
    commune: rapport.user.localite.idCommune,
    prefecture: rapport.user.localite.idPrefecture,
    region: rapport.user.localite.idRegion,

  } as RapportDisplay
}

@Component({
  selector: 'app-surveillance',
  templateUrl: './surveillance.component.html',
  styleUrls: ['./surveillance.component.css']
})
export class SurveillanceComponent implements OnInit, AfterViewInit {

  displayedColumns = ['date', 'mois', 'typeCas', 'casAvere', 'casEmpeche', 'prefectures', 'communes', 'quartiers', 'secteurs', 'surveillant', 'action'];
  dataSource: MatTableDataSource<RapportDisplay> = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  surveillancUrl = `api/${SURVEILLANCE_URL}`; 
  annees$: Observable<number[]>;
  mois$: Observable<Mois[]>
  typeCas$: Observable<TypeCas[]>
  localite$: Observable<Secteur[]>;
  localite = LOCALITE;

  isExporting = false;

  panelOpenState = false
  params: RequestSurveillanceParam;
  surveillanceUrl = SURVEILLANCE_URL;

  permissions = {
    can_delete: false
  }
  
  pageSize = 10;
  currentPage = 0;
  totalRows = 0;

  constructor(private srvService: SurveillanceService,
              private auth: AuthService,
              private utils: UtilService,
              private findLocalite: FindLocalitePipe,
              private datePipe: DatePipe,
              private cdrf: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.setPermissions();
    const date = new Date();
    this.params = {
      annee: date.getFullYear(),
      mois: date.getMonth()
    }
    this.iniData({page: this.currentPage, size: this.pageSize});
    this.loadInfos();
  }

  ngAfterContentChecked() {
    this.cdrf.detectChanges();
  }
  /* async iniData(params?: RequestSurveillanceParam) {
    const data = await this.srvService.getAllRapport(params).pipe(
      map(rapports => rapports.map(mapper))
    ).toPromise();
    // console.log(data);
    this.dataSource.data.push.apply(this.dataSource.data, data);
    this.dataSource._updateChangeSubscription();
  } */

  async iniData(params: RequestSurveillanceParam  = { page: this.currentPage, size: this.pageSize }) {
    const data = await this.srvService
      .getAllRapport(params).pipe(
        tap(rapport => this.totalRows = rapport.totalItem),
        map(rapport => rapport.data.map(mapper)),
    ).toPromise(); 
    this.dataSource.data = data;  
    // console.log(data);
    // this.dataSource.data.push.apply(this.dataSource.data, data);
    // this.dataSource._updateChangeSubscription();
    setTimeout(() => {
      this.paginator.pageIndex = this.currentPage;
      this.paginator.length = this.totalRows;
    });
  }

  onSearch(params: RequestSurveillanceParam) {
    // console.log(this.params);
    // this.dataSource.data = [];
    params.page = 0;
    params.size = 5;

    this.iniData(params);
  }

  onRefresh() {
    this.dataSource.data = [];
    this.iniData();
  }

  resetForm() {
    this.params = {};
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
    // console.log(this.dataSource.data)
  }

  loadInfos() {
    this.annees$ = this.srvService.getYears();
    this.mois$ = this.srvService.getAllMois();
    this.typeCas$ = this.srvService.getTypeCas();
    this.localite$ = this.srvService.getSecteurs();
  }

  @Confirmable({html: 'Voulez-vous supprimer ce rapport ?', icon: 'warning'})
  onDelete(id: number) {
    this.srvService.deleteRapport(id).subscribe(
      () => {
        this.utils.showNotif('Suppression effectuée avec succès', 'success')
        const index = this.dataSource.data.findIndex(rp => rp.id === id);
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
      },
      err => {
        this.utils.showNotif(`Une erreur est survenue lors de la suppression ${err}`, 'danger')
      }
    )
  }

   ngAfterViewInit() {
     this.dataSource.paginator = this.paginator;
     this.dataSource.sort = this.sort;
   }

   setPermissions() {
     const authPermissions = this.auth.getPermissions();
     this.permissions = {
       can_delete: authPermissions.includes(PERMISSIONS.CAN_DELETE_SURVEILLANCE)
     }
   }

   // ========================== Export ================================ //

  async mapForExport(rapports: RapportDisplay[]) {
    const exportData = [];
    for (const {index, data} of rapports.map((data, index) => ({index, data}))) {
      const prefecture = await this.findLocalite.transform(data.prefecture, LOCALITE.PREFECTURE).toPromise()
      const commune = await this.findLocalite.transform(data.commune, LOCALITE.COMMUNE).toPromise()
      const quartier = await this.findLocalite.transform(data.quartier, LOCALITE.QUARTIER).toPromise()
      const secteur = await this.findLocalite.transform(data.secteur, LOCALITE.SECTEUR).toPromise()
      const date = await this.datePipe.transform(data.date, 'dd/MM/yyyy');
      exportData.push({
        '#': index + 1,
        // 'Année': data.annee,
        'Date': date,
        'Mois': data.mois,
        'Type de cas': data.typeCas,
        'Cas averé(s)': data.casAvere,
        'Cas empeché(s)': data.casEmpeche,
        'Prefecture': prefecture.nom,
        'Commune': commune.nom,
        'Quartier': quartier.nom,
        'Secteur': secteur.nom,
        'Surveillant': data.surveillant
      })
    }
    return exportData;
  }

  async onExport() {
    this.isExporting = true;
    const data = await this.mapForExport(this.dataSource.data);
    this.isExporting = false;
    this.utils.jsonToExcel(data, 'rapports_surveillance');
  }

  pageChanged(event: PageEvent) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.totalRows = event.length;
    this.iniData({ page: this.currentPage, size: this.pageSize });
  }

}
