import { STATUT_CAS, STATUT_ALERTE } from 'app/config/app.data';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestCasParam } from '../models/request-cas-param';


const isValidNumber = (num: number) => (!!num && !isNaN(num));

const makeParams = (requestParam: RequestCasParam) => {
  let params = '?';
  params += requestParam.dateDebut && requestParam.dateFin ?
                `dateDebut=${requestParam.dateDebut}&dateFin=${requestParam.dateFin}` : '';
  params += isValidNumber(requestParam.ageDebut) && isValidNumber(requestParam.ageFin) ?
                `&ageDebut=${requestParam.ageDebut}&ageFin=${requestParam.ageFin}` : '';

  params += isValidNumber(requestParam.idRegion) ? '&idRegion=' + requestParam.idRegion : '';
  params += isValidNumber(requestParam.idPrefecture) ? '&idPrefecture=' + requestParam.idPrefecture : '';
  params += isValidNumber(requestParam.idCommune) ? '&idCommune=' + requestParam.idCommune : '';
  params += isValidNumber(requestParam.idQuartier) ? '&idQuartier=' + requestParam.idQuartier : '';
  params += isValidNumber(requestParam.idSecteur) ? '&idSecteur=' + requestParam.idSecteur : '';

  return params;
}
export interface Stats {
  statut?: string
  region?: string
  prefecture?: string
  typeCas?: string
  nombre: number
}

export interface StatServiceItem {
  service: string,
  stats: Stats[]
}

const API_URL = environment.apiUrl;
export const STATS_URL = 'statistiques/';

@Injectable({
  providedIn: 'root'
})
export class StatService {

  constructor(private http: HttpClient) { }

  findByStatutAlerte(debut: string = '', fin: string = ''): Observable<Stats[]> {
    if(debut === '' || fin === '') {
      return this.http.get<Stats[]>(API_URL + STATS_URL + 'alertes/statut');
    }

    return this.http.get<Stats[]>(API_URL + STATS_URL + 
      `alertes/statut/intervalle?debut=${debut}&fin=${fin}`);
  }

  findByRegionAlerte(debut: string = '', fin: string = ''): Observable<Stats[]> {
    if(debut === '' || fin === '') {
      return this.http.get<Stats[]>(API_URL + STATS_URL + 'alertes/regions');
    }

    return this.http.get<Stats[]>(API_URL + STATS_URL +
       `alertes/regions/intervalle?debut=${debut}&fin=${fin}`);
  }

  countByStatutAlerte(statut: STATUT_ALERTE, debut: string = '', fin: string = ''): Observable<number> {
    if(debut === '' || fin === '') {
      return this.http.get<number>(API_URL + STATS_URL +
        `alertes/count?statut=${statut}`)
    }

    return this.http.get<number>(API_URL + STATS_URL +
      `alertes/intervalle?statut=${statut}&debut=${debut}&fin=${fin}`) 
  }

  findByStatutCas(debut: string = '', fin: string = ''): Observable<Stats[]> {
    if(debut === '' || fin === '') {
      return this.http.get<Stats[]>(API_URL + STATS_URL + 'cas/statut');
    }

    return this.http.get<Stats[]>(API_URL + STATS_URL +
       `cas/statut/intervalle?debut=${debut}&fin=${fin}`);
  }

  findByRegionCas(debut: string = '', fin: string = ''): Observable<Stats[]> {
    if(debut === '' || fin === '') {
      return this.http.get<Stats[]>(API_URL + STATS_URL + 'cas/regions');
    }

    return this.http.get<Stats[]>(API_URL + STATS_URL + `cas/regions/intervalle?debut=${debut}&fin=${fin}`);
  }

  countByStatutCas(statut: STATUT_CAS, debut: string = '', fin: string = ''): Observable<number> {
    if(debut === '' || fin === '') {
      return this.http.get<number>(API_URL + STATS_URL + `cas/count?statut=${statut}`)
    }

    return this.http.get<number>(API_URL + STATS_URL + 
      `cas/intervalle?statut=${statut}&debut=${debut}&fin=${fin}`)
  }

  // ============================================================================= //

  statByCasService(params?: RequestCasParam): Observable<StatServiceItem[]> {
    let request = `${API_URL + STATS_URL}cas/services`;
    if (params) {
      request += makeParams(params);
    }
    return this.http.get<StatServiceItem[]>(request)
  }

  statByCasTypeCas(params?: RequestCasParam): Observable<Stats[]> {
    let request = `${API_URL + STATS_URL}cas/type-cas`;
    if (params) {
      request += makeParams(params);
    }
    return this.http.get<Stats[]>(request)
  }
}
