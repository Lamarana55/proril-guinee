
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthService } from 'app/project/auth/services/auth.service';
import { Router } from '@angular/router';
import { UtilService } from 'app/project/core/services/util.service';
import { Confirmable } from 'app/project/core/decorators/confirmable.decorator';
import { PERMISSIONS, STATUT } from 'app/config/app.data';
import { BehaviorSubject } from 'rxjs';
import { Article } from '../models/article.model';
import { ArticleService, ARTICLE_URL } from '../services/article.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup } from '@angular/forms';
import {PageEvent} from '@angular/material/paginator';
import { map, tap } from 'rxjs/operators';

declare interface ArticleDisplay{
  id: number
  titre: string
  isVedette: Boolean
  statut: string
  categorieArticle: string
  categorieArticleId:number,
  description: string,
  observation: string
  imageURL: string
  date:string
}

const mapper = (article: Article) => {
  return {
    id: article.id,
    titre: article.titre,
    isVedette: article.isVedette,
    statut: article.statut,
    categorieArticle: article.categorieArticle,
    categorieArticleId: article.idCategorieArticle,
    description: article.description,
    observation: article.observation,
    imageURL: article.image
  } 
}

declare interface RequestParam {
  titre?: string
  date?: string
  dateDebut?: string
  dateFin?: string
  statut?: string
  page?: number
  size?: number
}
@Component({
  selector: 'app-list-categorie',
  templateUrl: './list-article.component.html',
  styleUrls: ['./list-article.component.css']
})
export class ListArticleComponent implements OnInit {
  
  subject = new BehaviorSubject(0);
  displayedColumns = ['titre','categorie','isVedette', 'statut', 'action'];
  dataSource: MatTableDataSource<ArticleDisplay> = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  articleStatut = STATUT

  permissions = {
    can_view_info: false,
    can_add: false,
    can_edit: false,
    can_delete: false
  }
  
  articleUrl = ARTICLE_URL;

  searchForm: FormGroup
  titre = null;
  categorie = '';
  vedette = '';
  statut = '';

  //================
  
  constructor(private articleService: ArticleService,
              private auth: AuthService,
              private router: Router,
              private utils: UtilService) { }

  
 
  ngOnInit() {
    this.initSearchForm();
    this.setPermissions();
    //this.getArticles();
    //this.dataSource.filterPredicate = this.getFilterPredicate();
    this.dataSource.paginator = this.paginator;

    
    this.iniData({ page: this.currentPage, size: this.pageSize});
  }

  async getArticles() {
    const data = await this.articleService.getAllArticle().toPromise().catch(() => []);
    
    this.dataSource.data = [];
    this.dataSource.data.push.apply(this.dataSource.data, data.data);
    this.dataSource._updateChangeSubscription(); 
  }

  initSearchForm(){
    this.searchForm = new FormGroup({
      titre: new FormControl(''),
      categorie: new FormControl(''),
      // vedette: new FormControl(''),
      statut: new FormControl('')
    });
  }

  
   // Methode appele pour chaque ligne du datatable
    getFilterPredicate() {
    return (row: ArticleDisplay, filters: string) => {
      const filterArray = filters.split('$');
      const titre = filterArray[0];
      const categorie = filterArray[1];
      const statut = filterArray[2];

      const matchFilter = [];

      // Chaque donnee de la ligne
      const columnTitre = row.titre;
      // const columnVictime = row.victime; // + row.sexeVictime;
      const columnCategorie = row.categorieArticle;
      const columnStatut = row.statut;

      // Verification
      const customFilterTitre = columnTitre.toLowerCase().includes(titre);
      // const customFilterVictime = columnVictime.toLowerCase().includes(victime);
      const customFilterCategorie = columnCategorie.toLowerCase().includes(categorie);
      const customFilterStatut = columnStatut.toLowerCase().indexOf(statut) === 0;

      matchFilter.push.apply(matchFilter, [customFilterTitre, customFilterCategorie, customFilterStatut]);

      return matchFilter.every(Boolean);
    }
  } 


  applyFilter() {
    const { titre, categorie, statut} = this.searchForm.value;
    this.titre = titre === null ? '': titre;
    this.categorie = categorie === null ? '': categorie
    // this.vedette = vedette == null ? '': vedette
    this.statut = statut === null ? '' : statut;
    
    const filterValue = this.titre + '$' + this.categorie + '$' + this.statut;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



  gotoEdit(id: number) {
    this.router.navigate(['/articles/list-article/edit', {id: id}]);
  }

  onRefresh() {
    this.initSearchForm();
    this.getArticles();
    //this.iniData()
  }

  @Confirmable({html: 'Voulez-vous supprimer cet article ?', icon: 'warning'})
  onDelete(id: number) {
    this.articleService.deleteArticle(id).subscribe(
      () => {
        this.utils.showNotif('Suppression effectuée avec succès', 'success')
        this.onRefresh();
      },
      err => {
        this.utils.showNotif(`Une erreur est survenue lors de la suppression ${err}`, 'danger')
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  setPermissions() {
    const authPermissions = this.auth.getPermissions();
    this.permissions = {
      can_view_info: authPermissions.includes(PERMISSIONS.CAN_VIEW_ARTICLE_INFO),
      can_add: authPermissions.includes(PERMISSIONS.CAN_ADD_ARTICLE),
      can_edit: authPermissions.includes(PERMISSIONS.CAN_UPDATE_ARTICLE),
      can_delete: authPermissions.includes(PERMISSIONS.CAN_DELETE_ARTICLE)
    }
  }


  onChangeStatus(id: number, article: Article) {
    this.articleService.updateStatutArticle(id, article).subscribe(() => this.subject.next(0));
  }

  showDescription(description){
    Swal.fire({
      title: 'Detail Description',
      text:  description,
      showCancelButton: false,
      cancelButtonColor: '#3085d6',
      cancelButtonText: 'Fermer',
       
    })
  }

  showObservation(observation){
    Swal.fire({
      title: 'Detail Observation',
      text: observation,
      showCancelButton: false,
      cancelButtonColor: '#3085d6',
      cancelButtonText: 'Fermer'
    })
  }
  pageSize = 10;
  currentPage = 0;
  totalRows=0;

  params: RequestParam;

  initValue(event:any){
    this.titre = event.target.value
    //this.params = {titre:event.target.value}
  }
  onSearch() {
    
    
     this.dataSource.data = [];
     this.params = {titre:this.titre,page:0, size:10}
    
     
    this.iniData(this.params);
  }
  // code de la pagination 

  async iniData(params: RequestParam={page: this.currentPage, size: this.pageSize}) {
    const data = await this.articleService.getAllArticlePage(params).pipe(
      tap(donner => this.totalRows = donner.totalItem),
      map(donner => donner.data.map(mapper)),
    ).toPromise();
    
    this.dataSource.data.push.apply(this.dataSource.data, data);
    this.dataSource._updateChangeSubscription(); 
    
    setTimeout(() => {
      this.paginator.pageIndex = this.currentPage;
      this.paginator.length =  this.totalRows;
    })
  }

  pageChanged(event: PageEvent) {
     
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.totalRows = event.length;

    this.params ={page : this.currentPage,size : this.pageSize}
    
    
    // this.iniData(this.params);
    //this.totalRows = event.length;
    this.iniData({page: this.currentPage, size: this.pageSize});
  }
}
