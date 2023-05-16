import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestCasParam } from 'app/mgf/core/models/request-cas-param';
import { Pagination } from 'app/mgf/utils/pagination';
import { RequestParamPagination } from 'app/mgf/utils/resquest.pagination';
import { Observable } from 'rxjs';
import { Alerte } from '../models/alerte.model';
import { Cas } from '../models/cas.model';
import { Reponse } from '../models/reponse.model';
import { Victime } from '../models/victime.model';
import { environment } from './../../../../environments/environment';
import { TraitementCas } from './../models/traitement-cas.model';

const API_URL = environment.apiUrl;

export const CAS_URL = 'cas';
export const ALERTE_URL = 'alertes';
export const VICTIME_URL = 'victimes';
export const REPONSE_URL = 'reponses';
export const TRAITEMENT_CAS_URL = 'traitements';

declare interface RequestAlerteParam {
  searchType?: 'DATE' | 'DATE_BETWEEN' | 'STATUT'
  date?: string
  dateDebut?: string
  dateFin?: string
  statut?: string
  page?: number
  size?: number
}

const isValidNumber = (num: number) => (!!num && !isNaN(num));
 
const makeParams = (requestParam: RequestCasParam) => {
  let params = '';
    params += requestParam.dateDebut && requestParam.dateFin ?
                  `&dateDebut=${requestParam.dateDebut}&dateFin=${requestParam.dateFin}` : '';
    params += isValidNumber(requestParam.ageDebut) && isValidNumber(requestParam.ageFin) ?
                  `&ageDebut=${requestParam.ageDebut}&ageFin=${requestParam.ageFin}` : '';

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
export class GestionCasService {

  constructor(private http: HttpClient) { }

  // ============================== Gestion des cas ================================== //

  getAllCas(params?: RequestCasParam): Observable<Pagination>{
    let request = API_URL + CAS_URL + `?page=${params.page}&size=${params.size}`;
    if (params) {
      request += makeParams(params);
    }
    return this.http.get<Pagination>(request);
  }
 
  getOneCas(id: number): Observable<Cas> {
    return this.http.get<Cas>(API_URL + CAS_URL + `/${id}`);
  }

  addCas(cas: Partial<Cas>): Observable<Cas> {
    return this.http.post<Cas>(API_URL + CAS_URL, cas);
  }

  updateCas(id: number, cas: Partial<Cas>): Observable<Cas> {
    return this.http.put<Cas>(API_URL + CAS_URL + `/${id}`, cas);
  }

  deleteCas(id: number): Observable<any> {
    return this.http.delete(API_URL + CAS_URL + `/${id}`);
  }

  // =================================== Gestion des alertes ===================================== //

  getAllAlertes(params?: RequestAlerteParam): Observable<{data: Alerte[], totalItem: number}> {
    let request = API_URL + ALERTE_URL  + `?page=${params.page}&size=${params.size}`;
    if (params && params.searchType) {
      request += `&type=${params.searchType}`;
      switch (params.searchType) {
        case 'STATUT':
          request += `&value=${params.statut}`;
          break;
        case 'DATE':
          request += `&value=${params.date}`;
          break;
        case 'DATE_BETWEEN':
          request += `&value=${params.dateDebut};${params.dateFin}`;
          break;
      }
    }
    return this.http.get<{data: Alerte[], totalItem: number}>(request);
  }

  getOneAlerte(id: number): Observable<Alerte> {
    return this.http.get<Alerte>(API_URL + ALERTE_URL + `/${id}`);
  }

  addAlerte(alerte: Partial<Alerte>): Observable<Alerte> {
    return this.http.post<Alerte>(API_URL + ALERTE_URL, alerte);
  }

  updateAlerte(id: number, alerte: Partial<Alerte>): Observable<Alerte> {
    return this.http.put<Alerte>(API_URL + ALERTE_URL + `/${id}`, alerte);
  }

  treateAlerte(id: number): Observable<Alerte> {
    return this.http.put<Alerte>(API_URL + ALERTE_URL + `/traitement/${id}`, {});
  }

  affecteAlerte(id: number, userId: number): Observable<Alerte> {
    return this.http.put<Alerte>(API_URL + ALERTE_URL + `/affectation/${id}/${userId}`, {});
  }

  deleteAlerte(id: number): Observable<any> {
    return this.http.delete(API_URL + ALERTE_URL + `/${id}`);
  }

  // ================================= Gestion des reponses ================================== //

  getAllReponses(idCas: number): Observable<Reponse[]> {
    return this.http.get<Reponse[]>(API_URL + REPONSE_URL + `/findByCas/${idCas}`);
  }

  getOneReponse(id: number): Observable<Reponse> {
    return this.http.get<Reponse>(API_URL + REPONSE_URL + `/${id}`);
  }

  addReponse(reponse: Partial<Reponse>): Observable<Reponse> {
    return this.http.post<Reponse>(API_URL + REPONSE_URL, reponse);
  }

  updateReponse(id: number, reponse: Partial<Reponse>): Observable<Reponse> {
    return this.http.put<Reponse>(API_URL + REPONSE_URL + `/${id}`, reponse);
  }

  deleteReponse(id: number): Observable<any> {
    return this.http.delete(API_URL + REPONSE_URL + `/${id}`);
  }

  // ================================ Traitement des cas ================================= //

  getAllTraitements(idCas: number): Observable<TraitementCas[]> {
    return this.http.get<TraitementCas[]>(API_URL + TRAITEMENT_CAS_URL + `/findByCas/${idCas}`);
  }

  getOneTraitement(id: number): Observable<TraitementCas> {
    return this.http.get<TraitementCas>(API_URL + TRAITEMENT_CAS_URL + `/${id}`);
  }

  addTraitement(traitement: Partial<TraitementCas>): Observable<TraitementCas> {
    return this.http.post<TraitementCas>(API_URL + TRAITEMENT_CAS_URL, traitement);
  }

  updateTraitement(id: number, traitement: Partial<TraitementCas>): Observable<TraitementCas> {
    return this.http.put<TraitementCas>(API_URL + TRAITEMENT_CAS_URL + `/${id}`, traitement);
  }

  deleteTraitement(id: number): Observable<any> {
    return this.http.delete(API_URL + TRAITEMENT_CAS_URL + `/${id}`);
  }

  // =========================== Gestion des victimes ================================== //

  getAllVictimes(params?: RequestParamPagination): Observable<Pagination> {
    return this.http.get<Pagination>(API_URL + VICTIME_URL + `?page=${params.page}&size=${params.size}`);
  }

  getOneVictime(id: number): Observable<Victime> {
    return this.http.get<Victime>(API_URL + VICTIME_URL + `/${id}`);
  }

  addVictime(victime: Partial<Victime>): Observable<Victime> {
    return this.http.post<Victime>(API_URL + VICTIME_URL, victime);
  }

  updateVictime(id: number, victime: Partial<Victime>): Observable<Victime> {
    return this.http.put<Victime>(API_URL + VICTIME_URL + `/${id}`, victime);
  }

  deleteVictime(id: number): Observable<any> {
    return this.http.delete(API_URL + VICTIME_URL + `/${id}`);
  }
}
