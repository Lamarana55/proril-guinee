import { Pipe, PipeTransform } from '@angular/core';
import { LOCALITE } from 'app/config/app.data';
import { Observable, of } from 'rxjs';
import { Commune } from '../models/commune.model';
import { Prefecture } from '../models/prefecture.model';
import { Quartier } from '../models/quartier.model';
import { Region } from '../models/region.model';
import { Secteur } from '../models/secteur.model';
import { LocaliteService } from '../services/localite.service';

@Pipe({
  name: 'findLocalite'
})
export class FindLocalitePipe implements PipeTransform {

  constructor(private localiteService: LocaliteService) {}

  transform(value: number, localite: string): Observable<Region | Prefecture | Commune | Quartier | Secteur> {
    if (value) {
      if (localite === LOCALITE.REGION) {
        return this.localiteService.getOneRegion(value);
      } else if (localite === LOCALITE.PREFECTURE) {
        return this.localiteService.getOnePrefecture(value);
      } else if (localite === LOCALITE.COMMUNE) {
        return this.localiteService.getOnecommune(value);
      } else if (localite === LOCALITE.QUARTIER) {
        return this.localiteService.getOneQuartier(value);
      } else if (localite === LOCALITE.SECTEUR) {
        return this.localiteService.getOneSecteur(value);
      }
    }
    return of();
  }

}
