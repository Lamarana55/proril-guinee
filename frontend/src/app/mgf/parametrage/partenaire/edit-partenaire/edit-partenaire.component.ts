import { Partenaire } from './../../models/partenaire.model';
import { ParametrageService, PARTENAIRE_URL } from './../../services/parametrage.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from 'app/mgf/core/services/util.service';

@Component({
  selector: 'app-edit-partenaire',
  templateUrl: './edit-partenaire.component.html',
  styleUrls: ['./edit-partenaire.component.css']
})
export class EditPartenaireComponent implements OnInit {

  isNew = true;
  partenaireId = 0;
  partenaireForm: FormGroup;
  partenaireUrl = PARTENAIRE_URL;
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
    this.partenaireId = this.route.snapshot.params['id'];
    this.isNew = isNaN(this.partenaireId);
    this.initForm();

    if (!this.isNew) {
      this.mapPartenaire();
    }
  }

  initForm() {
    this.partenaireForm = this.fb.group({
      nom: ['', Validators.required],
      sigle: '',
      description: ''
    })
  }

  resetForm() {
    this.initForm();
    this.partenaireForm.markAsUntouched();
    this.partenaireForm.markAsPristine();
    this.partenaireForm.updateValueAndValidity();
  }

  onSubmit() {
    if (this.partenaireForm.invalid) {
      const controls = this.partenaireForm.controls;
      Object.keys(controls).forEach(key => controls[key].markAsTouched())
      return;
    }

    const partenaire  = this.partenaireForm.value as Partial<Partenaire>;
    const action$ = this.isNew ?
                      this.paramService.addPartenaire(partenaire) :
                        this.paramService.updatePartenaire(this.partenaireId, partenaire);

    action$.subscribe(
      () => {
        this.utils.showNotif('Operation effectuée avec succès', 'success');
        this.isNew ? this.resetForm() : this.router.navigate(['/parametrages/type-cas'])
      },
      err => {
        this.utils.showNotif(`Une erreur est survenue lors de l'opération \n ${err}`, 'danger')
      }
    )
  } 

  async mapPartenaire() {
    const partenaire = await this.paramService.getOnePartenaire(this.partenaireId).toPromise();
    this.partenaireForm.patchValue({
      nom: partenaire.nom,
      sigle: partenaire.sigle,
      description: partenaire.description
    })
  }

}
