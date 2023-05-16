import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from 'app/mgf/core/services/util.service';
import { Observable } from 'rxjs';
import { CategorieArticle } from '../models/categorie-article.model';
import { ArticleService, CATEGORIE_ARTICLE_URL } from '../services/article.service';

@Component({
  selector: 'app-add-edit-article',
  templateUrl: './add-edit-article.component.html',
  styleUrls: ['./add-edit-article.component.css']
})
export class AddEditArticleComponent implements OnInit {

  isNew = true;
  articleId = 0;
  formulaire: FormGroup;
  categorieAlerteUrl = CATEGORIE_ARTICLE_URL;
  returnUrl = '..';
  file: File = null;
  formData = new FormData();
  dataImage:any={};
  categories$: Observable<CategorieArticle[]>;
  isNewimage:boolean = false
  dataCategorie:any = {}
  constructor(private fb: FormBuilder,
              private articleService: ArticleService,
              private route: ActivatedRoute,
              private util: UtilService,
              private router: Router) { }

  async ngOnInit(): Promise<void> {
    this.util.previousUrl$.subscribe(url => {
      this.returnUrl = !!url ? url : this.returnUrl;
    })
    this.articleId = this.route.snapshot.params['id'];
    this.isNew = isNaN(this.articleId);
    this.initForm();
    this.categories$ = this.articleService.getAllCategorie()
     
    if (!this.isNew) {
      this.mapCategorie(); 
     await this.initImage(this.articleId)
      this.formulaire.patchValue({
        file:this.dataImage.fileName
      })
      
    }
  }

  initForm() {
    this.formulaire = this.fb.group({
      titre: ['', Validators.required],
      description: '',
      isVedette: false,
      observation:'',
      idCategorieArticle:['', Validators.required],
      file: ['', Validators.required],
    })

  }
  async initImage(id:any){
    this.dataImage =  await this.articleService.getImageArticle(id).toPromise()
    
  }
  resetForm() {
    this.initForm();
    this.formulaire.markAsUntouched();
    this.formulaire.markAsPristine();
    this.formulaire.updateValueAndValidity();
  }

  uploadFile(event) {
   !this.isNew? this.isNewimage = true : this.isNewimage = false
    this.file = event.target.files[0];
     
     this.formData.append("file",this.file);
     this.formulaire.patchValue({
      file: this.file.name
    });
    
  }
  onSubmit() {
    if (this.formulaire.invalid) {
      const controls = this.formulaire.controls;
      Object.keys(controls).forEach(key => controls[key].markAsTouched())
      return;
    }
    
    const article  = this.formulaire.value ;
    
    const action$ = this.isNew ?
                        this.articleService.addArticle(article) :
                            this.articleService.updateArticle(this.articleId, article);
   action$.subscribe(
      async (data) => {
        if (!this.isNew) {
            if (this.isNewimage) {
             
             await this.articleService.deleteImageArticle(this.dataImage.id).toPromise()
         
             this.formData.append('id',data.id.toString())
             this.articleService.imageArticle(this.formData).toPromise()
            }
        }else{
          this.formData.append('id',data.id.toString())
          this.articleService.imageArticle(this.formData).subscribe(
            (d)=>{
             
          }, (err)=>{
             
          })
        }
        
        this.util.showNotif('Operation effectuée avec succès', 'success');
        this.isNew ? this.resetForm() : this.router.navigate(['/articles/list-article']) 
      },
      err => {
        this.util.showNotif(`Une erreur est survenue lors de l'opération \n ${err}`, 'danger')
      }
    ) 
  }

  async mapCategorie() {
    const article = await this.articleService.getOneArticle(this.articleId).toPromise();
    this.dataCategorie = article.categorieArticle
    this.formulaire.patchValue({
      titre: article.titre,
      description: article.description,
      isVedette: article.isVedette,
      observation: article.observation,
      idCategorieArticle: this.dataCategorie.id
    })

     
    //console.info(this.formulaire.value.idCategorieArticle.id)
     
    //console.info(article.categorieArticle)
  }

}
