
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthService } from 'app/mgf/auth/services/auth.service';
import { Router } from '@angular/router';
import { UtilService } from 'app/mgf/core/services/util.service';
import { Confirmable } from 'app/mgf/core/decorators/confirmable.decorator';
import { PERMISSIONS } from 'app/config/app.data';
import { CategorieArticle } from '../../models/categorie-article.model';
import { ArticleService, CATEGORIE_ARTICLE_URL } from '../../services/article.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-list-categorie',
  templateUrl: './list-categorie.component.html',
  styleUrls: ['./list-categorie.component.css']
})
export class ListCategorieComponent implements OnInit, AfterViewInit{
  
  subject = new BehaviorSubject(0);
  displayedColumns = ['libelle', 'description', 'statut', 'action'];
  dataSource: MatTableDataSource<CategorieArticle> = new MatTableDataSource([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  permissions = {
    can_add: false,
    can_edit: false,
    can_delete: false
  }

  categorieUrl = CATEGORIE_ARTICLE_URL;

  constructor(private articleService: ArticleService,
              private auth: AuthService,
              private router: Router,
              private utils: UtilService) { }
 
  ngOnInit() {
    this.setPermissions();
    this.getCategories();
  }

  async getCategories() {
    const data = await this.articleService.getAllCategorie().toPromise().catch(() => []);
    this.dataSource.data = [];
    this.dataSource.data.push.apply(this.dataSource.data, data);
    this.dataSource._updateChangeSubscription();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  gotoEdit(id: number) {
    this.router.navigate(['/articles/categorie-articles/edit', {id: id}]);
  }

  onRefresh() {
    this.getCategories();
  }

  @Confirmable({html: 'Voulez-vous supprimer cette categorie d\'article ?', icon: 'warning'})
  onDelete(id: number) {
    this.articleService.deleteCategorie(id).subscribe(
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
      can_add: authPermissions.includes(PERMISSIONS.CAN_ADD_CATEGORIE_ARTICLE),
      can_edit: authPermissions.includes(PERMISSIONS.CAN_UPDATE_CATEGORIE_ARTICLE),
      can_delete: authPermissions.includes(PERMISSIONS.CAN_DELETE_CATEGORIE_ARTICLE)
    }
  }


  onChangeStatus(id: number, categorie: CategorieArticle) {
    this.articleService.updateStatut(id, categorie).subscribe(() => this.subject.next(0));
  }
}
