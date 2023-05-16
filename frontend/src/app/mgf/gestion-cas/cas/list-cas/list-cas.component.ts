import { Confirmable } from "app/mgf/core/decorators/confirmable.decorator";
import { DatePipe } from "@angular/common";
import { StatusCasFormatPipe } from "./../../../core/pipes/status-cas-format.pipe";
import { FindLocalitePipe } from "./../../../core/pipes/find-localite.pipe";
import { CAS_URL } from "./../../services/gestion-cas.service";
import { Cas } from "./../../models/cas.model";
import { PERMISSIONS } from "app/config/app.data";
import { AuthService } from "app/mgf/auth/services/auth.service";
import { ParametrageService } from "./../../../parametrage/services/parametrage.service";
import { FormGroup, FormControl } from "@angular/forms";
import { Localite } from "./../../../core/models/localite.model";
import {
  LOCALITE,
  STATUT_CAS,
  DISPLAY_DATE_FORMAT,
} from "./../../../../config/app.data";
import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { GestionCasService } from "../../services/gestion-cas.service";
import { UtilService } from "app/mgf/core/services/util.service";
import { map, tap } from "rxjs/operators";
import { Observable } from "rxjs";
import { TypeCas } from "app/mgf/parametrage/models/type-cas.model";
import { RequestCasParam } from "app/mgf/core/models/request-cas-param";
import { ActivatedRoute } from "@angular/router";

declare interface CasDisplay {
  id: number;
  code: string;
  statut: string;
  typeCas: string;
  victime: string;
  localite: number;
  localiteType: string;
  date?: string;
  // For export
  ageVictime: number;
  nomVictime: string;
  prenomVictime: string;
  sexeVictime: string;
  adresseVictime: string;
  contactTuteurVictime: string;
  handicapVictime: string;
  alerte: string;

  localiteRegion: number;
  localitePrefecture: number;
  localiteCommune: number;
  localiteQuartier: number;
  localiteSecteur: number;
  description: string;
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
};

const mapper = (cas: Cas) => {
  return {
    id: cas.id,
    code: cas.code,
    typeCas: cas.typeCas.libelle,
    statut: cas.statut,
    victime: cas.victime ? `${cas.victime.nom} ${cas.victime.prenom}` : "--",
    localite: getLocalite(cas.localite).id,
    localiteType: getLocalite(cas.localite).type,
    date: cas.createdAt,
    // For export
    ageVictime: cas.victime ? cas.victime.age : null,
    nomVictime: cas.victime ? cas.victime.nom : "",
    prenomVictime: cas.victime ? cas.victime.prenom : "",
    sexeVictime: cas.victime ? cas.victime.sexe : "",
    adresseVictime: cas.victime ? cas.victime.adresse : "",
    contactTuteurVictime: cas.victime ? cas.victime.contactTuteur : "",
    handicapVictime: cas.victime ? cas.victime.handicap : "",
    alerte: cas.alerte ? cas.alerte.msisdn : "",
    localiteRegion: cas.localite.idRegion,
    localitePrefecture: cas.localite.idPrefecture,
    localiteCommune: cas.localite.idCommune,
    localiteQuartier: cas.localite.idQuartier,
    localiteSecteur: cas.localite.idSecteur,
    description: cas.description,
  } as CasDisplay;
};

@Component({
  selector: "app-list-cas",
  templateUrl: "./list-cas.component.html",
  styleUrls: ["./list-cas.component.css"],
})
export class ListCasComponent implements OnInit, AfterViewInit {
  displayedColumns = [
    "date",
    "code",
    "typeCas",
    "victime",
    "ageVictime",
    "sexeVictime",
    "localite",
    "alerte",
    "statut",
    "action",
  ];
  dataSource: MatTableDataSource<CasDisplay> = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  typeCas$: Observable<TypeCas[]>;
  statutCas = STATUT_CAS;

  // option: string;

  casUrl = `api/${CAS_URL}`;

  searchForm: FormGroup;

  // params: RequestCasParam;
  code = "";
  typeCas = "";
  victime = "";
  statut = "";

  isExporting = false;

  permissions = {
    can_add: false,
    can_update: false,
    can_view_info: false,
    can_delete: false,
  };

  pageSize = 10;
  currentPage = 0;
  totalRows = 0;

  constructor(
    private gestCasService: GestionCasService,
    private auth: AuthService,
    private paramService: ParametrageService,
    private utils: UtilService,
    private findLocalite: FindLocalitePipe,
    private statusCasFormat: StatusCasFormatPipe,
    private datePipe: DatePipe,
    private _activeRoute: ActivatedRoute,
    private cdrf: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.setPermissions();
/*     this.option = this._activeRoute.snapshot.paramMap.get('option');
    console.log("Option : ", this.option); */
    
    this.dataSource.filterPredicate = this.getFilterPredicate();
    this.iniData();
    this.initSearchForm();
    this.typeCas$ = this.paramService.getAllTypeCas();
  }

  initSearchForm() {
    this.searchForm = new FormGroup({
      code: new FormControl(""),
      typeCas: new FormControl(""),
      victime: new FormControl(""),
      statut: new FormControl(""),
    });
  }

  
  async iniData(params: RequestCasParam = { page: this.currentPage, size: this.pageSize }) {

    const data = await this.gestCasService
      .getAllCas(params)
      .pipe(
        tap((cas) => (this.totalRows = cas.totalItem)),
        map((cas) => cas.data.map(mapper))
      )
      .toPromise();

    this.dataSource.data = data;

    //this.dataSource.data.push.apply(this.dataSource.data, data);

    // console.log("Total", this.totalRows);
    //this.totalRows = data.
    setTimeout(() => {
      this.paginator.pageIndex = this.currentPage;
      this.paginator.length = this.totalRows;
    });
  }

  onSearch(params: RequestCasParam) {
    if (params) {
      // this.dataSource.data = [];
      // this.iniData(params);

      params.page = 0;
      params.size = 10;

      this.iniData(params);
    }
  }

  onRefresh() {
    this.dataSource.data = [];
    this.iniData();
  }

  // Methode appele pour chaque ligne du datatable
  getFilterPredicate() {
    return (row: CasDisplay, filters: string) => {
      const filterArray = filters.split("$");
      const code = filterArray[0];
      const typeCas = filterArray[1];
      const victime = filterArray[2];
      const statut = filterArray[3];

      const matchFilter = [];

      // Chaque donnee de la ligne
      const columnCode = row.code;
      const columnTypeCas = row.typeCas;
      const columnVictime = row.victime + row.sexeVictime;
      const columnStatut = row.statut;

      // Verification
      const customFilterCode = columnCode.toLowerCase().includes(code);
      const customFilterTypeCas = columnTypeCas.toLowerCase().includes(typeCas);
      const customFilterVictime = columnVictime.toLowerCase().includes(victime);
      const customFilterStatut = columnStatut.toLowerCase().includes(statut);

      matchFilter.push.apply(matchFilter, [
        customFilterCode,
        customFilterTypeCas,
        customFilterVictime,
        customFilterStatut,
      ]);

      return matchFilter.every(Boolean);
    };
  }

  applyFilter() {
    const { code, typeCas, victime, statut } = this.searchForm.value;
    this.code = code === null ? "" : code;
    this.typeCas = typeCas === null ? "" : typeCas;
    this.victime = victime === null ? "" : victime;
    this.statut = statut === null ? "" : statut;
    const filterValue =
      this.code + "$" + this.typeCas + "$" + this.victime + "$" + this.statut;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @Confirmable({ html: "Voulez-vous supprimer ce cas ?", icon: "warning" })
  onDelete(id: number) {
    this.gestCasService.deleteCas(id).subscribe(
      () => {
        this.utils.showNotif("Cas supprimé avec succès", "success");
        const index = this.dataSource.data.findIndex((cd) => cd.id === id);
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
      },
      (err) => {
        this.utils.showNotif(
          `Une erreur est survenue lors de la suppression ${err}`,
          "danger"
        );
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  setPermissions() {
    const permissions = this.auth.getPermissions();
    this.permissions = {
      can_add: permissions.includes(PERMISSIONS.CAN_ADD_CAS),
      can_update: permissions.includes(PERMISSIONS.CAN_UPDATE_CAS),
      can_view_info: permissions.includes(PERMISSIONS.CAN_VIEW_CAS_INFO),
      can_delete: permissions.includes(PERMISSIONS.CAN_DELETE_CAS),
    };
  }

  ngAfterContentChecked() {
    this.cdrf.detectChanges();
  }
  // ========================== Export ================================ //

  async mapForExport(casDisplay: CasDisplay[]) {
    const exportData = [];
    for (const { index, data } of casDisplay.map((data, index) => ({
      index,
      data,
    }))) {
      const region = await this.findLocalite
        .transform(data.localiteRegion, LOCALITE.REGION)
        .toPromise();
      const prefecture = await this.findLocalite
        .transform(data.localitePrefecture, LOCALITE.PREFECTURE)
        .toPromise();
      const commune = await this.findLocalite
        .transform(data.localiteCommune, LOCALITE.COMMUNE)
        .toPromise();
      const quartier = await this.findLocalite
        .transform(data.localiteQuartier, LOCALITE.QUARTIER)
        .toPromise();
      const secteur = await this.findLocalite
        .transform(data.localiteSecteur, LOCALITE.SECTEUR)
        .toPromise();

      exportData.push({
        "#": index + 1,
        Date: this.datePipe.transform(data.date, DISPLAY_DATE_FORMAT),
        Code: data.code,
        "Type de cas": data.typeCas,
        Nom: data.nomVictime,
        Prenom: data.prenomVictime,
        Age: data.ageVictime,
        Sexe: data.sexeVictime,
        Handicap: data.handicapVictime,
        "Contact Tuteur": data.contactTuteurVictime,
        Region: region ? region.nom : "",
        Prefecture: prefecture ? prefecture.nom : "",
        "S.P/Commune": commune ? commune.nom : "",
        Quartier: quartier ? quartier.nom : "",
        Secteur: secteur ? secteur.nom : "",
        Description: data.description,
        Statut: this.statusCasFormat.transform(data.statut),
      });
    }
    return exportData;
  }

  async onExport() {
    this.isExporting = true;
    const data = await this.mapForExport(this.dataSource.data);
    this.isExporting = false;
    this.utils.jsonToExcel(data, "list_cas");
  }

  pageChanged(event: PageEvent) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.totalRows = event.length;
    this.iniData({ page: this.currentPage, size: this.pageSize });
  }
}
