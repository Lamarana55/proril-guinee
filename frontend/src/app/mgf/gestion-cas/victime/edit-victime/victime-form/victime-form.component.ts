import { UtilService } from './../../../../core/services/util.service';
import { NUMBER_ONLY_PATTERN, TEL_PATTERN } from './../../../../../config/app.data';
import { GestionCasService, VICTIME_URL } from './../../../services/gestion-cas.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { Victime } from 'app/mgf/gestion-cas/models/victime.model';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-victime-form',
  templateUrl: './victime-form.component.html',
  styleUrls: ['./victime-form.component.css']
})
export class VictimeFormComponent implements OnInit, OnChanges {

  @Input() isNew = true;
  @Input() victimeId = 0;
  @Output() isDone = new EventEmitter<boolean>();

  victiomForm: FormGroup;
  victimeUrl = VICTIME_URL;

  constructor(private fb: FormBuilder,
              private gestCasService: GestionCasService,
              private utils: UtilService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.victiomForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      age: [null, [Validators.required, Validators.pattern(NUMBER_ONLY_PATTERN)]],
      sexe: ['F', Validators.required],
      handicap: ['NON', Validators.required],
      adresse: '',
      contactTuteur: ['', Validators.pattern(TEL_PATTERN)]
    })
  }

  resetForm() {
    this.initForm();
    this.victiomForm.markAsUntouched();
    this.victiomForm.markAsPristine();
    this.victiomForm.updateValueAndValidity();
  }

  /* onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.victiomForm.patchValue({
        fileSource: file
      });
    }
  } */

  onSubmit() {
    if (this.victiomForm.invalid) {
      const controls = this.victiomForm.controls;
      Object.keys(controls).forEach(key => controls[key].markAsTouched())
      return;
    }

    const victime = this.victiomForm.value as Partial<Victime>;
    const action$ = this.isNew ? this.gestCasService.addVictime(victime) :
                      this.gestCasService.updateVictime(this.victimeId, victime);

    action$.subscribe(
      () => {
        this.utils.showNotif('Operation effectuée avec succès', 'success');
        this.isNew ? this.resetForm() : this.isDone.emit(true);
      },
      err => {
        this.utils.showNotif(`Une erreur est survenue lors de l'opération \n ${err}`, 'danger')
      }
    )
  }

  async mapVictime() {
    const victime = await this.gestCasService.getOneVictime(this.victimeId).toPromise();
    this.victiomForm.patchValue({
      nom: victime.nom,
      prenom: victime.prenom,
      age: victime.age,
      sexe: victime.sexe,
      handicap: victime.handicap,
      adresse: victime.adresse,
      contactTuteur: victime.contactTuteur
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.isNew.currentValue && changes.victimeId.currentValue > 0) {
      this.mapVictime();
    }
  }

}
