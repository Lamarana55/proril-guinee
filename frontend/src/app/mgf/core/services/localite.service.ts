import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Localite } from '../models/localite.model';
import { Region } from '../models/region.model';
import { map, switchMap, tap } from 'rxjs/operators';
import { Commune } from '../models/commune.model';
import { Prefecture } from '../models/prefecture.model';
import { Quartier } from '../models/quartier.model';
import { Secteur } from '../models/secteur.model';

const resourceUrl = 'localites/';
const regionUrl = 'regions/';
const prefectureUrl = 'prefectures/';
const communeUrl = 'communes/';
const quartierUrl = 'quartiers/';
const secteurUrl = 'secteurs/';

const apiUrl = environment.apiUrl;

const isNotEmptyArray = (arr: any[]) => !!arr && arr.length > 0;

@Injectable({
  providedIn: 'root'
})
export class LocaliteService {

  subjectRegion = new BehaviorSubject(0);
  subjectPrefecture = new BehaviorSubject(0);
  subjectCommune = new BehaviorSubject(0);
  subjectQuartier = new BehaviorSubject(0);
  subjectSecteur = new BehaviorSubject(0);

  // ======================== Caching ======================== //
  regions: Region[];
  prefectures: Prefecture[];
  communes: Commune[];
  quartiers: Quartier[];
  sectuers: Secteur[];

  constructor(private http: HttpClient) { }

  // ==================================================================================== //
  // =============================== Gestion de la localite ============================= //
  // ==================================================================================== //

  getAll(): Observable<Localite[]> {
    return this.http.get<Localite[]>(apiUrl + resourceUrl);
  }

  getOne(id: number): Observable<Localite> {
    return this.http.get<Localite>(apiUrl + resourceUrl + id);
  }

  add(localite: Partial<Localite>): Observable<Localite> {
    return this.http.post<Localite>(apiUrl + resourceUrl, localite);
  }

  update(localite: Partial<Localite>): Observable<Localite> {
    return this.http.put<Localite>(apiUrl + resourceUrl + localite.id, localite);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(apiUrl + resourceUrl + id);
  }

  // ==================================================================================== //
  // ===================== Gestion de la region, prefecture et commune ================== //
  // ==================================================================================== //

  getRegions(): Observable<Region[]> {
    if (isNotEmptyArray(this.regions)) {
      return of(this.regions)
    }
    return this.http.get<Region[]>(apiUrl + regionUrl).pipe(
      tap(regions => this.regions = regions)
    );
  }

  getOneRegion(id: number): Observable<Region> {
    if (isNotEmptyArray(this.regions)) {
      const region = this.regions.find(rg => rg.id === id);
      return of(region)
    }
    return this.http.get<Region>(apiUrl + regionUrl + id);
  }

  getPrefectures(): Observable<Prefecture[]> {
    if (isNotEmptyArray(this.prefectures)) {
      return of(this.prefectures)
    }
    return this.http.get<Prefecture[]>(apiUrl + prefectureUrl).pipe(
      tap(prefectures => this.prefectures = prefectures)
    );
  }

  getOnePrefecture(id: number): Observable<Prefecture> {
    if (isNotEmptyArray(this.prefectures)) {
      const prefecture = this.prefectures.find(pref => pref.id === id);
      return of(prefecture)
    }
    return this.http.get<Prefecture>(apiUrl + prefectureUrl + id)
  }

  getCommunes(): Observable<Commune[]> {
    if (isNotEmptyArray(this.communes)) {
      return of(this.communes)
    }
    return this.http.get<Commune[]>(apiUrl + communeUrl).pipe(
      tap(communes => this.communes = communes)
    );
  }

  getOnecommune(id: number): Observable<Commune> {
    if (isNotEmptyArray(this.communes)) {
      const commune = this.communes.find(cm => cm.id === id);
      return of(commune)
    }
    return this.http.get<Commune>(apiUrl + communeUrl + id);
  }

  // ==================================================================================== //
  // ================================= Gestion du quartier ============================== //
  // ==================================================================================== //

  getAllQuartiers(): Observable<Quartier[]> {
    return this.http.get<Quartier[]>(apiUrl + quartierUrl);
  }

  getOneQuartier(id: number): Observable<Quartier> {
    return this.http.get<Quartier>(apiUrl + quartierUrl + id);
  }

  addQuartier(quartier: Partial<Quartier>): Observable<Quartier> {
    return this.http.post<Quartier>(apiUrl + quartierUrl, quartier);
  }

  updateQuartier(quartier: Partial<Quartier>): Observable<Quartier> {
    return this.http.put<Quartier>(apiUrl + quartierUrl + quartier.id, quartier);
  }

  deleteQuartier(id: number): Observable<any> {
    return this.http.delete(apiUrl + quartierUrl + id);
  }

  // ==================================================================================== //
  // ================================= Gestion du secteur =============================== //
  // ==================================================================================== //

  getAllSecteurs(): Observable<Secteur[]> {
    return this.http.get<Secteur[]>(apiUrl + secteurUrl);
  }

  getOneSecteur(id: number): Observable<Secteur> {
    return this.http.get<Secteur>(apiUrl + secteurUrl + id);
  }

  addSecteur(secteur: Partial<Secteur>): Observable<Secteur> {
    return this.http.post<Secteur>(apiUrl + secteurUrl, secteur);
  }

  updateSecteur(secteur: Partial<Secteur>): Observable<Secteur> {
    return this.http.put<Secteur>(apiUrl + secteurUrl + secteur.id, secteur);
  }

  deleteSecteur(id: number): Observable<any> {
    return this.http.delete(apiUrl + secteurUrl + id);
  }

  // ==================================================================================== //
  // ====================== Gestion des filtres sur les localites ======================= //
  // ==================================================================================== //

  getRegions$(): Observable<Region[]> {
    return this.subjectRegion.asObservable().pipe(
      switchMap(() => this.getRegions())
    );
  }

  getPrefectures$(): Observable<Prefecture[]> {
    return this.subjectPrefecture.asObservable().pipe(
      switchMap( idRegion => {
        if (idRegion === 0) {
          return this.getPrefectures();
        } else {
          return this.getPrefectures().pipe(
            map(prefectures => prefectures.filter(pref => pref.region.id === idRegion))
          );
        }
      })
    )
  }

  getCommunes$(): Observable<Commune[]> {
    return this.subjectCommune.asObservable().pipe(
      switchMap( idPrefecture => {
        if (idPrefecture === 0) {
          return this.getCommunes();
        } else {
          return this.getCommunes().pipe(
            map(communes => communes.filter(commune => commune.prefecture.id === idPrefecture))
          );
        }
      })
    )
  }

  getQuartiers$(): Observable<Quartier[]> {
    return this.subjectQuartier.asObservable().pipe(
      switchMap( idCommune => {
        if (idCommune === 0) {
          return this.getAllQuartiers();
        } else {
          return this.getAllQuartiers().pipe(
            map(quartiers => quartiers.filter(quartier => quartier.commune.id === idCommune))
          );
        }
      })
    );
  }

  getSecteurs$(): Observable<Secteur[]> {
    return this.subjectSecteur.asObservable().pipe(
      switchMap( idQuartier => {
        if (idQuartier === 0) {
          return this.getAllSecteurs();
        } else {
          return this.getAllSecteurs().pipe(
            map(secteurs => secteurs.filter(secteur => secteur.quartier.id === idQuartier))
          );
        }
      })
    )
  }
}
