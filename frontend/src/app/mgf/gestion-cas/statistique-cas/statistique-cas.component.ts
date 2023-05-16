import { RequestCasParam } from 'app/mgf/core/models/request-cas-param';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { STATS_URL } from 'app/mgf/core/services/stat.service';

@Component({
  selector: 'app-statistique-cas',
  templateUrl: './statistique-cas.component.html',
  styleUrls: ['./statistique-cas.component.css']
})
export class StatistiqueCasComponent implements OnInit {

  isService = false;
  params: RequestCasParam;
  paramsEl: RequestCasParam;
  statistiqueUrl = STATS_URL

  constructor(
    private cdrf: ChangeDetectorRef) { }

  ngOnInit(): void {
  }

  ngAfterContentChecked() {
    this.cdrf.detectChanges();
  }

  onSearch(params: RequestCasParam) {
    if (params) {
      this.params = params;
      this.params = Object.assign({}, this.params);
    }
  }

}
