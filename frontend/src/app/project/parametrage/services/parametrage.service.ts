
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Groupement } from '../models/Groupement.model';
import { Categorie } from '../models/categorie.model';
import { Marque } from '../models/marque.model';
import { environment } from './../../../../environments/environment';
import { Pagination } from 'app/project/utils/pagination';
import { RequestGroupementParam } from 'app/project/core/models/request-groupement.model';
import { RequestMarqueParam } from 'app/project/core/models/request.marque.model';

const API_URL = environment.apiUrl;

export const SERVICE_URL = 'services';
export const TYPE_CAS_URL = 'type-cas';
export const CATEGORIE_URL = 'categories';
export const GROUPEMENT_URL = 'groupements';
export const MARQUE_URL =  'marques';



const isValidNumber = (num: number) => (!!num && !isNaN(num));
 
const makeParams = (requestParam: RequestGroupementParam) => {
  let params = '';
    params += isValidNumber(requestParam.idRegion) ? '&idRegion=' + requestParam.idRegion : '';
    params += isValidNumber(requestParam.idPrefecture) ? '&idPrefecture=' + requestParam.idPrefecture : '';
    params += isValidNumber(requestParam.idCommune) ? '&idCommune=' + requestParam.idCommune : '';
    params += isValidNumber(requestParam.idQuartier) ? '&idQuartier=' + requestParam.idQuartier : '';
    return params;
}

@Injectable({
  providedIn: 'root'
})
export class ParametrageService {

  constructor(private http: HttpClient) { }

  // =============================== Categorie =============================== //

  getAllCategories(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(API_URL + CATEGORIE_URL);
  }

  getOneCategorie(id: number): Observable<Categorie> {
    return this.http.get<Categorie>(API_URL + CATEGORIE_URL + '/' + id);
  }

  addCategorie(categorie: Partial<Categorie>): Observable<Categorie> {
    return this.http.post<Categorie>(API_URL + CATEGORIE_URL, categorie);
  }

  updateCategorie(id: number, categorie: Partial<Categorie>): Observable<Categorie> {
    return this.http.put<Categorie>(API_URL + CATEGORIE_URL + '/' + id, categorie);
  }

  deleteCategorie(id: number): Observable<any> {
    return this.http.delete(API_URL + CATEGORIE_URL + '/' + id);
  }

  // =============================== Groupement =============================== //

 /*  getAllGroupements(): Observable<Groupement[]> { 
    return this.http.get<Groupement[]>(API_URL + GROUPEMENT_URL);
  } */

  getAllGroupements(params?: RequestGroupementParam): Observable<Pagination> {
    let request = API_URL + GROUPEMENT_URL + `?page=${params.page}&size=${params.size}`;
    if (params) {
      request += makeParams(params);
    }
    return this.http.get<Pagination>(request);
    
  }
  
  getGroupements(): Observable<Groupement[]> {
    return this.http.get<Groupement[]>(API_URL + GROUPEMENT_URL + '/all');
  }

  getOneGroupement(id: number): Observable<Groupement> {
    return this.http.get<Groupement>(API_URL + GROUPEMENT_URL + '/' + id);
  }

  addGroupement(groupement: Partial<Groupement>): Observable<Groupement> {
    console.log(groupement);
    return this.http.post<Groupement>(API_URL + GROUPEMENT_URL, groupement);
  }

  updateGroupement(id: number, groupement: Partial<Groupement>): Observable<Groupement> {
    return this.http.put<Groupement>(API_URL + GROUPEMENT_URL + '/' + id, groupement);
  }

  deleteGroupement(id: number): Observable<any> {
    return this.http.delete(API_URL + GROUPEMENT_URL + '/' + id);
  }

  // =============================== Marque =============================== //

  getAllMarques(params?: RequestMarqueParam): Observable<Pagination> {
    let request = API_URL + MARQUE_URL + `?page=${params.page}&size=${params.size}`;
    if (params) {
      request += makeParams(params);
    }
    return this.http.get<Pagination>(request);
    
  }

  getMarques(): Observable<Marque[]> {
    return this.http.get<Marque[]>(API_URL + MARQUE_URL + '/all');
  }


  getOneMarque(id: number): Observable<Marque> {
    return this.http.get<Marque>(API_URL + MARQUE_URL + '/' + id);
  }

  addMarque(marque: Partial<Marque>): Observable<Marque> {
    return this.http.post<Marque>(API_URL + MARQUE_URL, marque);
  }

  updateMarque(id: number, marque: Partial<Marque>): Observable<Marque> {
    return this.http.put<Marque>(API_URL + MARQUE_URL + '/' + id, marque);
  }

  deleteMarque(id: number): Observable<any> {
    return this.http.delete(API_URL + MARQUE_URL + '/' + id);
  }

}
