import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DATE_FORMAT, LOCALITE } from 'app/config/app.data';
import { Commune } from 'app/mgf/core/models/commune.model';
import { Prefecture } from 'app/mgf/core/models/prefecture.model';
import { Quartier } from 'app/mgf/core/models/quartier.model';
import { Region } from 'app/mgf/core/models/region.model';
import { RequestAlerteParam } from 'app/mgf/core/models/request-alerte-param';
import { Secteur } from 'app/mgf/core/models/secteur.model';
import { LocaliteService } from 'app/mgf/core/services/localite.service';
import { TypeCas } from 'app/mgf/parametrage/models/type-cas.model';
import { Observable } from 'rxjs';
import { Mois } from '../models/mois.model';
import { SurveillanceService } from '../services/surveillance.service';
import { ParametrageService } from 'app/mgf/parametrage/services/parametrage.service';

@Component({
  selector: 'app-search-bar-alerte',
  templateUrl: './search-bar-alerte.component.html',
  styleUrls: ['./search-bar-alerte.component.css']
})
export class SearchBarAlerteComponent implements OnInit {

  @Input() isLoading = false;
  @Input() expanded = false;
  @Output() onSearchEvent = new EventEmitter<RequestAlerteParam>();

  typeCas$: Observable<TypeCas[]>;

  panelOpenState = false;
  params: RequestAlerteParam;
  localites = LOCALITE;

  // Localités
  regions$: Observable<Region[]>;
  prefectures$: Observable<Prefecture[]>;
  communes$: Observable<Commune[]>;
  quartiers$: Observable<Quartier[]>;
  secteurs$: Observable<Secteur[]>;

  constructor(private datePipe: DatePipe,
              private localiteService: LocaliteService,
              private parametreService: ParametrageService) { }

  ngOnInit(): void {
    const now = this.datePipe.transform(new Date(), DATE_FORMAT);
    this.params = {
      dateDebut: now,
      dateFin: now
    }
    this.loadLocaliteInfos();
    this.loadInfos();
  }
  loadLocaliteInfos() {
    this.regions$ = this.localiteService.getRegions$();
    this.prefectures$ = this.localiteService.getPrefectures$();
    this.communes$ = this.localiteService.getCommunes$();
    this.quartiers$ = this.localiteService.getQuartiers$();
    this.secteurs$ = this.localiteService.getSecteurs$();

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

  loadInfos() {
    this.typeCas$ = this.parametreService.getAllTypeCas();
  }

}
