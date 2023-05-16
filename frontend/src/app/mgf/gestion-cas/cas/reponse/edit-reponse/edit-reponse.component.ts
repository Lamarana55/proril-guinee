import { Observable } from 'rxjs';
import { UtilService } from 'app/mgf/core/services/util.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GestionCasService, REPONSE_URL } from './../../../services/gestion-cas.service';
import { Component, Input, OnInit, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { Reponse } from 'app/mgf/gestion-cas/models/reponse.model';
import { tap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-reponse',
  templateUrl: './edit-reponse.component.html',
  styleUrls: ['./edit-reponse.component.css']
})
export class EditReponseComponent implements OnInit, OnChanges {

  @Input() reponseId: number
  @Output() isDone = new EventEmitter<boolean>();

  oldReponse$: Observable<Reponse>;
  reponseForm: FormGroup;
  reponseUrl = REPONSE_URL;

  constructor(private fb: FormBuilder,
              private gestCasService: GestionCasService,
              private utils: UtilService) { }

  ngOnInit(): void {
    this.initForm();
    this.mapValues();
  }

  initForm() {
    this.reponseForm = this.fb.group({
      reponse: [null, Validators.required],
      description: ''
    });
  }

  resetForm() {
    this.initForm();
    this.reponseForm.markAsUntouched();
    this.reponseForm.markAsPristine();
    this.reponseForm.updateValueAndValidity();
  }

  async onSubmit(oldReponse: Reponse) {
    if (this.reponseForm.valid) {
      const rep: Partial<Reponse> = {};
      rep.reponse = this.reponseForm.value.reponse;
      rep.description = this.reponseForm.value.description;
      rep.cas = oldReponse.cas;
      rep.service = oldReponse.service;

      this.gestCasService.updateReponse(this.reponseId, rep).subscribe(
        () => {
          this.utils.showNotif('Modification effectuée avec succès', 'success');
          this.resetForm();
          this.isDone.emit(true)
        },
        err => {
          this.utils.showNotif(`Une erreur est survenue lors de l'opération ${err}`, 'danger');
        }
      )

    }
    return;
  }

  mapValues() {
    this.oldReponse$ = this.gestCasService.getOneReponse(this.reponseId).pipe(
      tap(rep => {
        this.reponseForm.patchValue({
          reponse: rep.reponse,
          description: rep.description
        })
      })
    )
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.reponseId.currentValue > 0) {
      this.mapValues()
    }
  }

}
