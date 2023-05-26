
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Groupement } from '../models/Groupement.model';
import { Categorie } from '../models/categorie.model';
import { Marque } from '../models/marque.model';
import { environment } from './../../../../environments/environment';

const API_URL = environment.apiUrl;

export const SERVICE_URL = 'services';
export const TYPE_CAS_URL = 'type-cas';
export const CATEGORIE_URL = 'categories';
export const GROUPEMENT_URL = 'groupements';
export const MARQUE_URL =  'marques';

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

  getAllGroupements(): Observable<Groupement[]> { 
    return this.http.get<Groupement[]>(API_URL + GROUPEMENT_URL);
  }

  getOneGroupement(id: number): Observable<Groupement> {
    return this.http.get<Groupement>(API_URL + GROUPEMENT_URL + '/' + id);
  }

  addGroupement(groupement: Partial<Groupement>): Observable<Groupement> {
    return this.http.post<Groupement>(API_URL + GROUPEMENT_URL, groupement);
  }

  updateGroupement(id: number, groupement: Partial<Groupement>): Observable<Groupement> {
    return this.http.put<Groupement>(API_URL + GROUPEMENT_URL + '/' + id, groupement);
  }

  deleteGroupement(id: number): Observable<any> {
    return this.http.delete(API_URL + GROUPEMENT_URL + '/' + id);
  }

  // =============================== Marque =============================== //

  getAllMarques(): Observable<Marque[]> {
    return this.http.get<Marque[]>(API_URL + MARQUE_URL);
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
