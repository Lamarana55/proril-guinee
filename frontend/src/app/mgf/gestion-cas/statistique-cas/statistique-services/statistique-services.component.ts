import { UtilService } from 'app/mgf/core/services/util.service';
import { ParametrageService } from './../../../parametrage/services/parametrage.service';
import { Component, Input, OnInit, SimpleChanges, OnChanges, ChangeDetectorRef } from '@angular/core';
import { RequestCasParam } from 'app/mgf/core/models/request-cas-param';
import { StatService, Stats, StatServiceItem } from 'app/mgf/core/services/stat.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { shareReplay, switchMap, tap, map } from 'rxjs/operators';

const isStats = (a: Stats | string): a is Stats => {
  return (a as Stats).typeCas !== undefined;
}

const compare = (a: Stats | string, b: Stats | string) => {
  if (typeof a === 'string' && typeof b === 'string') {
    return a.localeCompare(b);
  } else if (isStats(a) && isStats(b)) {
    return a.typeCas.localeCompare(b.typeCas);
  }
};

@Component({
  selector: 'app-statistique-services',
  templateUrl: './statistique-services.component.html',
  styleUrls: ['./statistique-services.component.css']
})
export class StatistiqueServicesComponent implements OnInit, OnChanges {

  @Input() params: RequestCasParam;
  headers: string[] = [];

  stats$: Observable<StatServiceItem[]>;
  subjectStat$ = new BehaviorSubject(0);

  isExporting = false;


  constructor(private statService: StatService,
              private paramService: ParametrageService,
              private utils: UtilService,
              private cdrf: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.stats$ = this.subjectStat$.asObservable().pipe(
      switchMap(() => this.paramService.getAllTypeCas().pipe(
        tap(typeCas => {
          this.headers = typeCas.map(tc => tc.libelle).sort(compare)
        }),
        shareReplay({bufferSize: 1, refCount: true})
      )),
      switchMap(() => this.statService.statByCasService(this.params).pipe(
        map(serviceStats => {
          return serviceStats.map(servStat => {
            const newServiceStat = {...servStat};
            const missingTypesCas = this.headers.filter(hd => newServiceStat.stats.every(st => st.typeCas !== hd));
            const stats: Stats[] = missingTypesCas.map(mc => ({typeCas: mc, nombre: 0}))
            stats.forEach(st => {
              newServiceStat.stats.push(st);
            })
            // Trie pour ordonner les valeurs
            newServiceStat.stats = newServiceStat.stats.sort(compare)
            return newServiceStat;
          })
        })
      ))
    )
  }

  ngOnChanges(simples: SimpleChanges) {
    if (simples.params.currentValue && !!this.stats$) {
      this.subjectStat$.next(1);
    }
  }

  ngAfterContentChecked() {
    this.cdrf.detectChanges();
  }
  

  // ========================== Export ================================ //

  mapForExport(itemStats: StatServiceItem[]) {
    const exportData = [];
    for (const {index, data} of itemStats.map((data, index) => ({index, data}))) {
      const service = {'#': index + 1, 'Servives': data.service};
      const stats = {};
      data.stats.forEach(stat => {
        stats[stat.typeCas] = stat.nombre;
      })
      exportData.push({...service, ...stats})
    }
    return exportData;
  }

  onExport(data: StatServiceItem[]) {
    const exportData = this.mapForExport(data);
    this.utils.jsonToExcel(exportData, 'statistiques_type_cas');
  }

}
