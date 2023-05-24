import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from 'app/project/core/services/util.service';
import { ArticleService } from '../services/article.service';

@Component({
  selector: 'app-info-article',
  templateUrl: './info-article.component.html',
  styleUrls: ['./info-article.component.css']
})
export class InfoArticleComponent implements OnInit {
  returnUrl = '..';
  isNew = true;
  articleId = 0;
  AllData:any;
  infoArticle:any
  infoImage:any
  isLoard:boolean = true
  constructor(private articleService: ArticleService,
              private route: ActivatedRoute,
              private util: UtilService,
              private router: Router ) { }

  ngOnInit(): void {
    this.util.previousUrl$.subscribe(url => {
      this.returnUrl = !!url ? url : this.returnUrl;
    })
    this.articleId = this.route.snapshot.params['id'];
    this.isNew = isNaN(this.articleId);
    this.getinfoArticle()
  }
  async getinfoArticle(){
    this.infoArticle = await this.articleService.getOneArticle(this.articleId).toPromise()
    this.infoImage = await this.articleService.getImageArticle(this.articleId).toPromise()
    this.AllData = {...this.infoArticle, ...this.infoImage}
    this.isLoard = false
    
  }

  return() {
    this.router.navigate(['/articles/list-article']);
  }

}
