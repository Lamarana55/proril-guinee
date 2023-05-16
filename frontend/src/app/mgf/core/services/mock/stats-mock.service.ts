import { STATUT_ALERTE, STATUT_CAS } from 'app/config/app.data';
import { HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

declare interface Stats {
  statut?: string
  region?: string
  prefecture?: string
  nombre: number
}

@Injectable({
  providedIn: 'root'
})
export class StatsMockService {

  constructor() { }

  // =================== Statistiques alertes mock =================== //

  getAlertesByStatus(): Observable<HttpEvent<Stats[]>> {
    return new Observable(observer => {
      observer.next(new HttpResponse<Array<Stats>>({
        body: [
          {nombre: 5, statut: STATUT_ALERTE.NON_TRAITE},
          {nombre: 4, statut: STATUT_ALERTE.TRAITE}
        ],
        status: 200
      }));
      observer.complete();
    })
  }

  getAlertesByRegion(): Observable<HttpEvent<Stats[]>> {
    return new Observable(observer => {
      observer.next(new HttpResponse<Array<Stats>>({
        body: [
          {nombre: 3, region: 'Conakry'},
          {nombre: 2, region: 'Boké'},
          {nombre: 2, region: 'Labé'},
          {nombre: 1, region: 'Kankan'},
          {nombre: 1, region: 'Mamou'}
        ],
        status: 200
      }));
      observer.complete();
    })
  }

  countAlertByStatus(): Observable<HttpEvent<number>> {
    return new Observable(observer => {
      observer.next(new HttpResponse<number>({
        body: 5,
        status: 200
      }));
      observer.complete();
    })
  }

  // =================== Statistiques Cas mock =================== //

  getCasByStatus(): Observable<HttpEvent<Stats[]>> {
    return new Observable(observer => {
      observer.next(new HttpResponse<Array<Stats>>({
        body: [
          {nombre: 5, statut: STATUT_CAS.EN_ATTENTE},
          {nombre: 4, statut: STATUT_CAS.EN_COURS},
          {nombre: 3, statut: STATUT_CAS.TRAITE},
          {nombre: 1, statut: STATUT_CAS.ANNULE}
        ],
        status: 200
      }));
      observer.complete();
    })
  }

  getCasByPrefecture(): Observable<HttpEvent<Stats[]>> {
    console.log('executeddddd');
    return new Observable(observer => {
      observer.next(new HttpResponse<Array<Stats>>({
        body: [
          {nombre: 6, prefecture: 'Conakry'},
          {nombre: 3, prefecture: 'Boké'},
          {nombre: 2, prefecture: 'Labé'},
          {nombre: 1, prefecture: 'Kindia'},
          {nombre: 1, prefecture: 'Mamou'}
        ],
        status: 200
      }));
      observer.complete();
    })
  }

  countCasByStatus(): Observable<HttpEvent<number>> {
    return new Observable(observer => {
      observer.next(new HttpResponse<number>({
        body: 5,
        status: 200
      }));
      observer.complete();
    })
  }


  route(req: HttpRequest<any>) {
    const url = req.url;
    if (url.endsWith('alertes/statut') && req.method === 'GET') {
      return this.getAlertesByStatus();
    } else if (url.endsWith('alertes/region') && req.method === 'GET') {
      return this.getAlertesByRegion();
    } else if (url.includes('alertes/count') && req.method === 'GET') {
      return this.countAlertByStatus();
    } else if (url.endsWith('cas/statut') && req.method === 'GET') {
      return this.getCasByStatus();
    } else if (url.endsWith('cas/prefecture') && req.method === 'GET') {
      return this.getCasByPrefecture();
    } else if (url.includes('cas/count') && req.method === 'GET') {
      return this.countCasByStatus();
    } else {
      return of(new HttpResponse({
        body: {},
        status: 404
      }))
    }
  }
}
