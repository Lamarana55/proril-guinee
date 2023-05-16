import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { CoreModule } from '../core/core.module';
import { MaterialModule } from '../material/material.module';
import {MatSlideToggleModule} from '@angular/material/slide-toggle'; 
import { AddEditArticleComponent } from './add-edit-article/add-edit-article.component';
import { ArticleRoutingModule } from './article-routing.module';
import { ArticleComponent } from './article.component';
import { AddEditCategorieComponent } from './categorie/add-edit-categorie/add-edit-categorie.component';
import { ListCategorieComponent } from './categorie/list-categorie/list-categorie.component';
import { InfoArticleComponent } from './info-article/info-article.component';
import { ListArticleComponent } from './list-article/list-article.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule, MatButtonToggleGroup } from '@angular/material/button-toggle';
@NgModule({
  declarations: [ 
    ListArticleComponent, 
    AddEditArticleComponent, 
    AddEditCategorieComponent, 
    ListCategorieComponent, 
    ArticleComponent, 
    InfoArticleComponent],
  imports: [
    CommonModule,
    ArticleRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
    MatTableModule, 
    MatPaginatorModule, 
    CoreModule,
    MatSlideToggleModule,
    MatInputModule,
    MatButtonToggleModule,

    FormsModule,
    
  ], 
  exports: [
    MatSlideToggleModule 
],
  providers: [DatePipe]
})
export class ArticleModule { }
