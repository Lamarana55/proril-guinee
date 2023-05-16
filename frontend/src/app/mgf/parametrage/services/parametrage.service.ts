import { Partenaire } from './../models/partenaire.model';
import { environment } from './../../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Question } from '../models/question.model';
import { TypeCas } from '../models/type-cas.model';
import { TypeAppui } from '../models/type-appui.model';

const API_URL = environment.apiUrl;

export const SERVICE_URL = 'services';
export const TYPE_CAS_URL = 'type-cas';
export const PARTENAIRE_URL = 'partenaires';
const typeAppuiUrl = 'type-appuis';

@Injectable({
  providedIn: 'root'
})
export class ParametrageService {

  constructor(private http: HttpClient) { }

  // =============================== Questionnaires =============================== //

  getAllQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(API_URL + SERVICE_URL);
  }

  getOneQuestion(id: number): Observable<Question> {
    return this.http.get<Question>(API_URL + SERVICE_URL + '/' + id);
  }

  addQuestion(question: Partial<Question>): Observable<Question> {
    return this.http.post<Question>(API_URL + SERVICE_URL, question);
  }

  updateQuestion(id: number, question: Partial<Question>): Observable<Question> {
    return this.http.put<Question>(API_URL + SERVICE_URL + '/' + id, question);
  }

  deleteQuestion(id: number): Observable<any> {
    return this.http.delete(API_URL + SERVICE_URL + '/' + id)
  }

  // =============================== Type Cas =============================== //

  getAllTypeCas(): Observable<TypeCas[]> {
    return this.http.get<TypeCas[]>(API_URL + TYPE_CAS_URL);
  }

  getOneTypeCas(id: number): Observable<TypeCas> {
    return this.http.get<TypeCas>(API_URL + TYPE_CAS_URL + '/' + id);
  }

  addTypeCas(typeCas: Partial<TypeCas>): Observable<TypeCas> {
    return this.http.post<TypeCas>(API_URL + TYPE_CAS_URL, typeCas);
  }

  updateTypeCas(id: number, typeCas: Partial<TypeCas>): Observable<TypeCas> {
    return this.http.put<TypeCas>(API_URL + TYPE_CAS_URL + '/' + id, typeCas);
  }

  deleteTypeCas(id: number): Observable<any> {
    return this.http.delete(API_URL + TYPE_CAS_URL + '/' + id)
  }


  // =============================== Partenaire =============================== //

  getAllPartenaires(): Observable<Partenaire[]> {
    return this.http.get<Partenaire[]>(API_URL + PARTENAIRE_URL);
  }

  getOnePartenaire(id: number): Observable<Partenaire> {
    return this.http.get<Partenaire>(API_URL + PARTENAIRE_URL + '/' + id);
  }

  addPartenaire(partenaire: Partial<Partenaire>): Observable<Partenaire> {
    return this.http.post<Partenaire>(API_URL + PARTENAIRE_URL, partenaire);
  }

  updatePartenaire(id: number, partenaire: Partial<Partenaire>): Observable<Partenaire> {
    return this.http.put<Partenaire>(API_URL + PARTENAIRE_URL + '/' + id, partenaire);
  }

  deletePartenaire(id: number): Observable<any> {
    return this.http.delete(API_URL + PARTENAIRE_URL + '/' + id)
  }

  // =============================== Type Appui =============================== //

  getAllTypeAppui(): Observable<TypeAppui[]> {
    return this.http.get<TypeAppui[]>(API_URL + typeAppuiUrl);
  }

  getOneTypeAppui(id: number): Observable<TypeAppui> {
    return this.http.get<TypeAppui>(API_URL + typeAppuiUrl + '/' + id);
  }

  addTypeAppui(typeAppui: Partial<TypeAppui>): Observable<TypeAppui> {
    return this.http.post<TypeAppui>(API_URL + typeAppuiUrl, typeAppui);
  }

  updateTypeAppui(id: number, typeAppui: Partial<TypeAppui>): Observable<TypeAppui> {
    return this.http.put<TypeAppui>(API_URL + typeAppuiUrl + '/' + id, typeAppui);
  }

  deleteTypeAppui(id: number): Observable<any> {
    return this.http.delete(API_URL + typeAppuiUrl + '/' + id)
  }
}
