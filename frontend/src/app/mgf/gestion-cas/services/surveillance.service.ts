import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Secteur } from 'app/mgf/core/models/secteur.model';
import { TypeCas } from 'app/mgf/parametrage/models/type-cas.model';
import { Observable } from 'rxjs';
import { Mois } from '../models/mois.model';
import { RapportSurveillance } from '../models/rapport-surveillance.model';
import { environment } from './../../../../environments/environment';

export interface RequestSurveillanceParam {
  annee?: number;
  mois?: number;
  idTypeCas?: number;
  dateDebut?: string;
  dateFin?: string;
  idRegion?: number;
  idPrefecture?: number;
  idCommune?: number;
  idQuartier?: number;
  idSecteur?: number;
  page?: number; 
  size?: number;
}
export const SURVEILLANCE_URL = 'surveillances';

const API_URL = environment.apiUrl;
const moisUrl = 'mois';

const isValidNumber = (num: number) => (!!num && !isNaN(num));
 
const makeParams = (requestParam: RequestSurveillanceParam) => {
  let params = '';
    params += requestParam.dateDebut && requestParam.dateFin ?
                  `&dateDebut=${requestParam.dateDebut}&dateFin=${requestParam.dateFin}` : '';
    params += requestParam.annee && !isNaN(requestParam.annee) ? `&annee=${requestParam.annee}` : '';
    params += requestParam.idTypeCas && !isNaN(requestParam.idTypeCas) ? `&idTypeCas=${requestParam.idTypeCas}` : '';
    params += requestParam.mois && !isNaN(requestParam.mois) ? `&mois=${requestParam.mois}` : '';

    params += isValidNumber(requestParam.idRegion) ? '&idRegion=' + requestParam.idRegion : '';
    params += isValidNumber(requestParam.idPrefecture) ? '&idPrefecture=' + requestParam.idPrefecture : '';
    params += isValidNumber(requestParam.idCommune) ? '&idCommune=' + requestParam.idCommune : '';
    params += isValidNumber(requestParam.idQuartier) ? '&idQuartier=' + requestParam.idQuartier : '';
    params += isValidNumber(requestParam.idSecteur) ? '&idSecteur=' + requestParam.idSecteur : '';

    return params;
}


@Injectable({
  providedIn: 'root'
})
export class SurveillanceService {

  constructor(private http: HttpClient) { }

 /*  getAllRapport(params?: RequestSurveillanceParam): Observable<RapportSurveillance[]> {
    let request = API_URL + SURVEILLANCE_URL;
    if (params) {
      request += '?';
      request += !!params.annee && !isNaN(params.annee) ? `annee=${params.annee}&` : '';
      request += !!params.mois && !isNaN(params.mois) ? `mois=${params.mois}&` : '';
      request += !!params.idSecteur && !isNaN(params.idSecteur) ? `idSecteur=${params.idSecteur}` : '';
    }
    return this.http.get<RapportSurveillance[]>(request)
  } */

  getAllRapport(params?: RequestSurveillanceParam): Observable<{data: RapportSurveillance[], totalItem: number}> {
    let request = API_URL + SURVEILLANCE_URL + `?page=${params.page}&size=${params.size}`;
    if (params) {
      request += makeParams(params);
    } 
    // console.log("Params :" , params);
    
    return this.http.get<{data: RapportSurveillance[], totalItem: number}>(request);

  }



  getOneRapport(id: number): Observable<RapportSurveillance> {
    return this.http.get<RapportSurveillance>(API_URL + SURVEILLANCE_URL + `/${id}`);
  }

  addRapport(rapport: Partial<RapportSurveillance>): Observable<RapportSurveillance> {
    return this.http.post<RapportSurveillance>(API_URL + SURVEILLANCE_URL, rapport);
  }

  updateRapport(id: number, rapport: Partial<RapportSurveillance>): Observable<RapportSurveillance> {
    return this.http.put<RapportSurveillance>(API_URL + SURVEILLANCE_URL + `/${id}`, rapport)
  }

  deleteRapport(id: number): Observable<any> {
    return this.http.delete(API_URL + SURVEILLANCE_URL + `/${id}`);
  }


  // ===================================== mois =========================================== //

  getAllMois(): Observable<Mois[]> {
    return this.http.get<Mois[]>(API_URL + moisUrl);
  }

  getOneMois(id: number): Observable<Mois> {
    return this.http.get<Mois>(API_URL + moisUrl + `/${id}`);
  }

  getYears(): Observable<number[]> {
    return this.http.get<number[]>(API_URL + SURVEILLANCE_URL + '/annees')
  }

  getSecteurs(): Observable<Secteur[]> {
    return this.http.get<Secteur[]>(API_URL + SURVEILLANCE_URL + '/secteurs')
  }

  getTypeCas():Observable<TypeCas[]>{
    return this.http.get<TypeCas[]>(API_URL + SURVEILLANCE_URL + '/type-cas')
  }
}
