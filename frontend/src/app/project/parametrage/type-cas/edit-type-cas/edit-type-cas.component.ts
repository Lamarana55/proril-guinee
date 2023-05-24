import { UtilService } from './../../../core/services/util.service';
import { TypeCas } from './../../models/type-cas.model';
import { ParametrageService, TYPE_CAS_URL } from './../../services/parametrage.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-type-cas',
  templateUrl: './edit-type-cas.component.html',
  styleUrls: ['./edit-type-cas.component.css']
})
export class EditTypeCasComponent implements OnInit {

  isNew = true;
  typeCasId = 0;
  typeCasForm: FormGroup;
  typeCasUrl = TYPE_CAS_URL;
  returnUrl = '..';

  constructor(private fb: FormBuilder,
              private paramService: ParametrageService,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar,
              private util: UtilService,
              private router: Router) { }

  ngOnInit(): void {
    this.util.previousUrl$.subscribe(url => {
      this.returnUrl = !!url ? url : this.returnUrl;
    })
    this.typeCasId = this.route.snapshot.params['id'];
    this.isNew = isNaN(this.typeCasId);
    this.initForm();

    if (!this.isNew) {
      this.mapTypeCas();
    }
  }

  initForm() {
    this.typeCasForm = this.fb.group({
      libelle: ['', Validators.required],
      rapport: [false, Validators.required],
      description: ''
    })
  }

  resetForm() {
    this.initForm();
    this.typeCasForm.markAsUntouched();
    this.typeCasForm.markAsPristine();
    this.typeCasForm.updateValueAndValidity();
  }

  onSubmit() {
    if (this.typeCasForm.invalid) {
      const controls = this.typeCasForm.controls;
      Object.keys(controls).forEach(key => controls[key].markAsTouched())
      return;
    }

    const typeCas  = this.typeCasForm.value as Partial<TypeCas>;
    const action$ = this.isNew ? this.paramService.addTypeCas(typeCas) : this.paramService.updateTypeCas(this.typeCasId, typeCas);

    action$.subscribe(
      () => {
        this.util.showNotif('Operation effectuée avec succès', 'success');
        this.isNew ? this.resetForm() : this.router.navigate(['/parametrages/type-cas'])
      },
      err => {
        this.util.showNotif(`Une erreur est survenue lors de l'opération \n ${err}`, 'danger')
      }
    )
  }

  async mapTypeCas() {
    const typeCas = await this.paramService.getOneTypeCas(this.typeCasId).toPromise();
    this.typeCasForm.patchValue({
      libelle: typeCas.libelle,
      rapport: typeCas.rapport,
      description: typeCas.description
    })
  }
}
