import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from 'app/mgf/core/services/util.service';
import { CategorieArticle } from '../../models/categorie-article.model';
import { ArticleService, CATEGORIE_ARTICLE_URL } from '../../services/article.service';

@Component({
  selector: 'app-add-edit-categorie',
  templateUrl: './add-edit-categorie.component.html',
  styleUrls: ['./add-edit-categorie.component.css']
})
export class AddEditCategorieComponent implements OnInit {
  isNew = true;
  categorieId = 0;
  categorieForm: FormGroup;
  categorieUrl = CATEGORIE_ARTICLE_URL;
  returnUrl = '..';

  constructor(private fb: FormBuilder,
              private articleService: ArticleService,
              private route: ActivatedRoute,
              private util: UtilService,
              private router: Router) { }

  ngOnInit(): void {
    this.util.previousUrl$.subscribe(url => {
      this.returnUrl = !!url ? url : this.returnUrl;
    })
    this.categorieId = this.route.snapshot.params['id'];
    this.isNew = isNaN(this.categorieId);
    this.initForm();

    if (!this.isNew) {
      this.mapCategorie();
    }
  }

  initForm() {
    this.categorieForm = this.fb.group({
      libelle: ['', Validators.required],
      description: ''
    })
  }

  resetForm() {
    this.initForm();
    this.categorieForm.markAsUntouched();
    this.categorieForm.markAsPristine();
    this.categorieForm.updateValueAndValidity();
  }

  onSubmit() {
    if (this.categorieForm.invalid) {
      const controls = this.categorieForm.controls;
      Object.keys(controls).forEach(key => controls[key].markAsTouched())
      return;
    }

    const categorie  = this.categorieForm.value as Partial<CategorieArticle>;
    const action$ = this.isNew ?
                        this.articleService.addCategorie(categorie) :
                            this.articleService.updateCategorie(this.categorieId, categorie);
    action$.subscribe(
      () => {
        this.util.showNotif('Operation effectuée avec succès', 'success');
        this.isNew ? this.resetForm() : this.router.navigate(['/articles/categorie-articles'])
      },
      err => {
        this.util.showNotif(`Une erreur est survenue lors de l'opération \n ${err}`, 'danger')
      }
    )
  }

  async mapCategorie() {
    const typeAlerte = await this.articleService.getOneCategorie(this.categorieId).toPromise();
    this.categorieForm.patchValue({
      libelle: typeAlerte.libelle,
      description: typeAlerte.description
    })
  }
}
