import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DATE_FORMAT, LOCALITE } from 'app/config/app.data';
import { Commune } from 'app/mgf/core/models/commune.model';
import { Prefecture } from 'app/mgf/core/models/prefecture.model';
import { Quartier } from 'app/mgf/core/models/quartier.model';
import { Region } from 'app/mgf/core/models/region.model';
import { RequestCasParam } from 'app/mgf/core/models/request-cas-param';
import { Secteur } from 'app/mgf/core/models/secteur.model';
import { LocaliteService } from 'app/mgf/core/services/localite.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

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

  constructor(private datePipe: DatePipe,
              private localiteService: LocaliteService) { }

  ngOnInit(): void {
    const now = this.datePipe.transform(new Date(), DATE_FORMAT);
    this.params = {
      dateDebut: now,
      dateFin: now
    }
    this.loadLocaliteInfos();
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

}
