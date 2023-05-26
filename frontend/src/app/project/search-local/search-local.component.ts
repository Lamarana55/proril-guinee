import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LOCALITE } from 'app/config/app.data';
//import { EventEmitter } from 'protractor';
import { Observable } from 'rxjs';
import { Commune } from '../core/models/commune.model';
import { Prefecture } from '../core/models/prefecture.model';
import { Quartier } from '../core/models/quartier.model';
import { Region } from '../core/models/region.model';
import { RequestCasParam } from '../core/models/request-cas-param';
import { Secteur } from '../core/models/secteur.model';
import { LocaliteService } from '../core/services/localite.service';
import { UserService } from '../user-management/services/user.service';

@Component({
  selector: 'app-search-local',
  templateUrl: './search-local.component.html',
  styleUrls: ['./search-local.component.css']
})
export class SearchLocalComponent implements OnInit {

  
  @Input() isLoading = false;
  @Input() expanded = false;
  @Output() onSearchEvent = new EventEmitter<RequestCasParam>();

  panelOpenState = false;
  params: RequestCasParam;
  localites = LOCALITE;

  // Localités
  regions$: Observable<Region[]>;
  prefectures$: Observable<Prefecture[]>;
  communes$: Observable<Commune[]>;
  quartiers$: Observable<Quartier[]>;
  secteurs$: Observable<Secteur[]>;
  roles$: any;

  constructor(
              private localiteService: LocaliteService, private UserService: UserService) { }

  ngOnInit(): void {
    /* const now = this.datePipe.transform(new Date(), DATE_FORMAT);*/
    this.params = {
      dateDebut: null,
      dateFin: null
    } 
    this.loadLocaliteInfos();
  }
  loadLocaliteInfos() {
    this.regions$ = this.localiteService.getRegions$();
    this.prefectures$ = this.localiteService.getPrefectures$();
    this.communes$ = this.localiteService.getCommunes$();
    this.quartiers$ = this.localiteService.getQuartiers$();
    this.secteurs$ = this.localiteService.getSecteurs$();
    this.roles$ = this.UserService.getAllRoles().toPromise();
   
    // initialisation
    this.localiteService.subjectRegion.next(0);
    this.localiteService.subjectPrefecture.next(0);
    this.localiteService.subjectCommune.next(0);
    this.localiteService.subjectQuartier.next(0);
    this.localiteService.subjectSecteur.next(0);
  }

  onSelectLocaliteChange(select: string) {
   
     if (select === LOCALITE.REGION) {
      this.localiteService.subjectPrefecture.next(this.params.idRegion);
    } else if (select === LOCALITE.PREFECTURE) {
      this.localiteService.subjectCommune.next(this.params.idPrefecture)
    } else if (select === LOCALITE.COMMUNE) {
      this.localiteService.subjectQuartier.next(this.params.idCommune);
    } else if (select === LOCALITE.QUARTIER) {
      this.localiteService.subjectSecteur.next(this.params.idQuartier);
    } 
  }

  onSearch() {
    
    if (this.params) {
      this.onSearchEvent.emit(this.params);
    }
  }

  resetForm() {
    this.params = {};
  }


}
