import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PERMISSIONS } from 'app/config/app.data';
import { RoleGuard } from '../auth/services/role-guard.service';
import { AddEditArticleComponent } from './add-edit-article/add-edit-article.component';
import { ArticleComponent } from './article.component';
import { AddEditCategorieComponent } from './categorie/add-edit-categorie/add-edit-categorie.component';
import { ListCategorieComponent } from './categorie/list-categorie/list-categorie.component';
import { InfoArticleComponent } from './info-article/info-article.component';
import { ListArticleComponent } from './list-article/list-article.component';

const routes: Routes = [
  {
    path: "",
    component: ArticleComponent,
    children: [
      {
        path: "",
        redirectTo: "list-article",
        pathMatch: "full",
      },
      {
        path: "list-article",
        children: [
          {
            path: "",
            component: ListArticleComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_VIEW_ARTICLE_LIST },
          },
          {
            path: "edit",
            component: AddEditArticleComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_ADD_ARTICLE },
          },
          {
            path: "info/:id",
            component: InfoArticleComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_VIEW_ARTICLE_INFO },
          },
        ],
      },
      {
        path: "categorie-articles",
        children: [
          {
            path: "",
            component: ListCategorieComponent,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_VIEW_CATEGORIE_ARTICLE_LIST },
          },
          {
            path: "edit",
            component: AddEditCategorieComponent ,
            canActivate: [RoleGuard],
            data: { permissions: PERMISSIONS.CAN_ADD_CATEGORIE_ARTICLE},
          },
        ],
      },
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArticleRoutingModule { }
