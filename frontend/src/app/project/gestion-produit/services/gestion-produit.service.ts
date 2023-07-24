
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../../../environments/environment';
import { Pagination } from 'app/project/utils/pagination';
import { RequestProduitParam } from 'app/project/core/models/request.produit.model';
import { Produit } from '../models/produit.model';
import { RequestClientParam } from 'app/project/core/models/request.client.model';
import { Client } from '../models/client.model';

const API_URL = environment.apiUrl;

export const PRODUIT_URL =  'produits';
export const CLIENT_URL =  'clients';



const isValidNumber = (num: number) => (!!num && !isNaN(num));
 
const makeParams = (requestParam: RequestProduitParam) => {
  let params = '';
    return params;
}

@Injectable({
  providedIn: 'root'
})
export class GestionProduitService {

  constructor(private http: HttpClient) { }

  // =============================== Produit =============================== //


  getAllProduits(params?: RequestProduitParam): Observable<Pagination> {
    let request = API_URL + PRODUIT_URL + `?page=${params.page}&size=${params.size}`;
    if (params) {
      request += makeParams(params);
    }
    return this.http.get<Pagination>(request);
    
  }
  
  getProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(API_URL + PRODUIT_URL + '/all');
  }

  getOneproduit(id: number): Observable<Produit> {
    return this.http.get<Produit>(API_URL + PRODUIT_URL + '/' + id);
  }

  addProduit(produit: Partial<Produit>): Observable<Produit> {
    console.log(produit);
    return this.http.post<Produit>(API_URL + PRODUIT_URL, produit);
  }

  updateProduit(id: number, produit: Partial<Produit>): Observable<Produit> {
    return this.http.put<Produit>(API_URL + PRODUIT_URL + '/' + id, produit);
  }

  deleteProduit(id: number): Observable<any> {
    return this.http.delete(API_URL + PRODUIT_URL + '/' + id);
  }

  // =============================== Client =============================== //

  getAllClients(params?: RequestClientParam): Observable<Pagination> {
    let request = API_URL + CLIENT_URL + `?page=${params.page}&size=${params.size}`;
    if (params) {
      request += makeParams(params);
    }
    return this.http.get<Pagination>(request);
    
  }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(API_URL + CLIENT_URL + '/all');
  }


  getOneClient(id: number): Observable<Client> {
    return this.http.get<Client>(API_URL + CLIENT_URL + '/' + id);
  }

  addClient(client: Partial<Client>): Observable<Client> {
    return this.http.post<Client>(API_URL + CLIENT_URL, client);
  }

  updateClient(id: number, client: Partial<Client>): Observable<Client> {
    return this.http.put<Client>(API_URL + CLIENT_URL + '/' + id, client);
  }

  deleteClient(id: number): Observable<any> {
    return this.http.delete(API_URL + CLIENT_URL + '/' + id);
  }


    // =============================== Ventes =============================== //


    getAllVentes(params?: RequestProduitParam): Observable<Pagination> {
      let request = API_URL + PRODUIT_URL + `?page=${params.page}&size=${params.size}`;
      if (params) {
        request += makeParams(params);
      }
      return this.http.get<Pagination>(request);
      
    }
    
    getProduits(): Observable<Produit[]> {
      return this.http.get<Produit[]>(API_URL + PRODUIT_URL + '/all');
    }
  
    getOneproduit(id: number): Observable<Produit> {
      return this.http.get<Produit>(API_URL + PRODUIT_URL + '/' + id);
    }
  
    addProduit(produit: Partial<Produit>): Observable<Produit> {
      console.log(produit);
      return this.http.post<Produit>(API_URL + PRODUIT_URL, produit);
    }
  
    updateProduit(id: number, produit: Partial<Produit>): Observable<Produit> {
      return this.http.put<Produit>(API_URL + PRODUIT_URL + '/' + id, produit);
    }
  
    deleteProduit(id: number): Observable<any> {
      return this.http.delete(API_URL + PRODUIT_URL + '/' + id);
    }

}
