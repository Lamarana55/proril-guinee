import { TypeAppui } from './../../models/type-appui.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from 'app/mgf/core/services/util.service';
import { ParametrageService } from '../../services/parametrage.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-type-appui',
  templateUrl: './edit-type-appui.component.html',
  styleUrls: ['./edit-type-appui.component.css']
})
export class EditTypeAppuiComponent implements OnInit {

  isNew = true;
  typeAppuiId = 0;
  typeAppuiForm: FormGroup;
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
    this.typeAppuiId = this.route.snapshot.params['id'];
    this.isNew = isNaN(this.typeAppuiId);
    this.initForm();

    if (!this.isNew) {
      this.mapTypeAppui();
    }
  }

  initForm() {
    this.typeAppuiForm = this.fb.group({
      libelle: ['', Validators.required],
      description: ''
    })
  }

  resetForm() {
    this.initForm();
    this.typeAppuiForm.markAsUntouched();
    this.typeAppuiForm.markAsPristine();
    this.typeAppuiForm.updateValueAndValidity();
  }

  onSubmit() {
    if (this.typeAppuiForm.invalid) {
      const controls = this.typeAppuiForm.controls;
      Object.keys(controls).forEach(key => controls[key].markAsTouched())
      return;
    }

    const typeAppui  = this.typeAppuiForm.value as Partial<TypeAppui>;
    const action$ = this.isNew ? this.paramService.addTypeAppui(typeAppui) : this.paramService.updateTypeAppui(this.typeAppuiId, typeAppui);

    this.isLoading = true;
    action$.pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(
      () => {
        this.utils.showNotif('Operation effectuée avec succès', 'success');
        this.isNew ? this.resetForm() : this.router.navigate(['/parametrages/type-cas'])
      },
      err => {
        this.utils.showNotif(`Une erreur est survenue lors de l'opération \n ${err}`, 'danger')
      }
    )
  }

  async mapTypeAppui() {
    const typeCas = await this.paramService.getOneTypeAppui(this.typeAppuiId).toPromise();
    this.typeAppuiForm.patchValue({
      libelle: typeCas.libelle,
      description: typeCas.description
    })
  }

}
