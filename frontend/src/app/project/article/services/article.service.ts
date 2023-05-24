import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { Article, ImageArticle } from '../models/article.model';
import { CategorieArticle } from '../models/categorie-article.model';


const API_URL = environment.apiUrl;
export const IMAGE_ARTICLE_URL = 'image-articles';
export const ARTICLE_URL = 'articles';
export const CATEGORIE_ARTICLE_URL = 'categorie-articles';

declare interface RequestAlerteParam {
  titre?: string
  date?: string
  dateDebut?: string
  dateFin?: string
  statut?: string
  page?: number
  size?: number
}


@Injectable({
  providedIn: "root",
})
export class ArticleService {
  constructor(private http: HttpClient) {}

  // =============================== Article =============================== //

  getAllArticle(): Observable<any> {
    return this.http.get(API_URL + ARTICLE_URL+ `?page=0&size=10`);
  }

  getAllArticlePage(params?: RequestAlerteParam): Observable<{data: Article[], totalItem: number}> {
  let request = API_URL + ARTICLE_URL  + `?page=${params.page}&size=${params.size}`;
  if (params && params.titre) {
    request += `&titre=${params.titre}`;
  }

  return this.http.get<{data: Article[], totalItem: number}>(request);
}

  getOneArticle(id: number): Observable<Article> {
    return this.http.get<Article>(API_URL + ARTICLE_URL + "/" + id);
  }

  addArticle(article: Partial<Article>): Observable<Article> {
    return this.http.post<Article>(API_URL + ARTICLE_URL, article);
  }

  updateArticle(id: number, article: Partial<Article>): Observable<Article> {
    return this.http.put<Article>(API_URL + ARTICLE_URL + "/" + id, article);
  }

  deleteArticle(id: number): Observable<any> {
    return this.http.delete(API_URL + ARTICLE_URL + "/" + id);
  }

  updateStatutArticle(
    id: number,
    article: Partial<Article>
  ): Observable<Article> {
    return this.http.put<Article>(
      API_URL + ARTICLE_URL + "/changeStatut/" + id,
      article
    );
  }
// ================ upload image d'un article =============================
imageArticle(data:any): Observable<any> {
  return this.http.post<any>(API_URL+ IMAGE_ARTICLE_URL,data,{
                                        reportProgress: true,
                                        observe: 'events'
                                    });
}
getImageArticle(id: number): Observable<ImageArticle> {
  return this.http.get<ImageArticle>(API_URL + IMAGE_ARTICLE_URL + "/get-image-article/" + id);
}
deleteImageArticle(id: number): Observable<any> {
  
  return this.http.delete(API_URL + IMAGE_ARTICLE_URL+"/" + id);
}
  // =============================== Categorie Article =============================== //

  getAllCategorie(): Observable<CategorieArticle[]> {
    return this.http.get<CategorieArticle[]>(API_URL + CATEGORIE_ARTICLE_URL);
  }

  getOneCategorie(id: number): Observable<CategorieArticle> {
    return this.http.get<CategorieArticle>(
      API_URL + CATEGORIE_ARTICLE_URL + "/" + id
    );
  }

  addCategorie(
    Categorie: Partial<CategorieArticle>
  ): Observable<CategorieArticle> {
    return this.http.post<CategorieArticle>(
      API_URL + CATEGORIE_ARTICLE_URL,
      Categorie
    );
  }

  updateCategorie(
    id: number,
    Categorie: Partial<CategorieArticle>
  ): Observable<CategorieArticle> {
    return this.http.put<CategorieArticle>(
      API_URL + CATEGORIE_ARTICLE_URL + "/" + id,
      Categorie
    );
  }

  deleteCategorie(id: number): Observable<any> {
    return this.http.delete(API_URL + CATEGORIE_ARTICLE_URL + "/" + id);
  }

  updateStatut(
    id: number,
    categorie: Partial<CategorieArticle>
  ): Observable<CategorieArticle> {
    return this.http.put<CategorieArticle>(
      API_URL + CATEGORIE_ARTICLE_URL + "/changeStatut/" + id,
      categorie
    );
  }
}
