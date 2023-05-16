import { UtilService } from 'app/mgf/core/services/util.service';
import { switchMap } from 'rxjs/operators';
import { Stats, StatService } from 'app/mgf/core/services/stat.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { RequestCasParam } from 'app/mgf/core/models/request-cas-param';
import { Component, Input, OnInit, SimpleChanges, OnChanges, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-statistique-type-cas',
  templateUrl: './statistique-type-cas.component.html',
  styleUrls: ['./statistique-type-cas.component.css']
})
export class StatistiqueTypeCasComponent implements OnInit, OnChanges {

  @Input() params: RequestCasParam;

  stats$: Observable<Stats[]>;
  subjectStat$ = new BehaviorSubject(0);

  isExporting = false;

  constructor(private statService: StatService,
              private utils: UtilService,
              private cdrf: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.stats$ = this.subjectStat$.asObservable().pipe(
      switchMap(() => this.statService.statByCasTypeCas(this.params))
    )
  }

  ngOnChanges(simples: SimpleChanges) {
    // console.log('child', this.params)
    if (simples.params.currentValue && !!this.stats$) {
      this.subjectStat$.next(1);
    }
  }

  ngAfterContentChecked() {
    this.cdrf.detectChanges();
  }
  // ========================== Export ================================ //

  mapForExport(stats: Stats[]) {
    const exportData = [];
    for (const {index, data} of stats.map((data, index) => ({index, data}))) {
      exportData.push({
        '#': index + 1,
        'Type de cas': data.typeCas,
        'Nombres': data.nombre,
      })
    }
    return exportData;
  }

  onExport(data: Stats[]) {
    const exportData = this.mapForExport(data);
    this.utils.jsonToExcel(exportData, 'statistiques_type_cas');
  }

}
