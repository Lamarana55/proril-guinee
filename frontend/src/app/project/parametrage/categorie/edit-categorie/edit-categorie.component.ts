import { Component, OnInit } from '@angular/core';

import { CATEGORIE_URL, ParametrageService } from './../../services/parametrage.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from 'app/project/core/services/util.service';
import { Categorie } from '../../models/categorie.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-categorie',
  templateUrl: './edit-categorie.component.html',
  styleUrls: ['./edit-categorie.component.css']
})
export class EditCategorieComponent implements OnInit {
  
  isNew = true;
  categorieId = 0;
  categorieForm: FormGroup;
  categorieUrl = CATEGORIE_URL;
  isLoading = false;
  returnUrl = '..';

  constructor(private fb: FormBuilder,
              private paramService: ParametrageService,
              private route: ActivatedRoute,
              private utils: UtilService,
              private router: Router) { }

  ngOnInit(): void {
    this.utils.previousUrl$.subscribe(url => {
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
      libelle: ['', [Validators.required, Validators.minLength(2)]],
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

    const categorie  = this.categorieForm.value as Partial<Categorie>;
    const action$ = this.isNew ? this.paramService.addCategorie(categorie) : this.paramService.updateCategorie(this.categorieId, categorie);

    this.isLoading = true;
    action$.pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(
      () => {
        this.utils.showNotif('Operation effectuée avec succès', 'success');
        this.isNew ? this.resetForm() : this.router.navigate(['/parametrages/categories'])
      },
      err => {
        this.utils.showNotif(`Une erreur est survenue lors de l'opération \n ${err}`, 'danger')
      }
    )
  }

  async mapCategorie() {
    const typeCas = await this.paramService.getOneCategorie(this.categorieId).toPromise();
    this.categorieForm.patchValue({
      libelle: typeCas.libelle,
      description: typeCas.description
    })
  }
}