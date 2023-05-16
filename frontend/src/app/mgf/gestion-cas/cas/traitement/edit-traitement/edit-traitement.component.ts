import { UtilService } from './../../../../core/services/util.service';
import { STATUT_CAS } from './../../../../../config/app.data';
import { GestionCasService, TRAITEMENT_CAS_URL } from './../../../services/gestion-cas.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { TraitementCas } from 'app/mgf/gestion-cas/models/traitement-cas.model';

@Component({
  selector: 'app-edit-traitement',
  templateUrl: './edit-traitement.component.html',
  styleUrls: ['./edit-traitement.component.css']
})
export class EditTraitementComponent implements OnInit {

  @Input() casId: number;
  @Input() oldStatut: string;
  @Output() isDone = new EventEmitter<boolean>();

  statusCas$ = STATUT_CAS;
  traitementForm: FormGroup;
  traitementUrl = TRAITEMENT_CAS_URL;

  constructor(private fb: FormBuilder,
              private gestCasService: GestionCasService,
              private utils: UtilService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.traitementForm = this.fb.group({
      statusCas: [this.oldStatut, Validators.required],
      description: ''
    });
  }

  resetForm() {
    this.initForm();
    this.traitementForm.markAsUntouched()
    this.traitementForm.markAsPristine();
    this.traitementForm.updateValueAndValidity();
  }

  async onSubmit() {
    const {statusCas, description} = this.traitementForm.value;

    if (this.traitementForm.valid && this.oldStatut !== statusCas) {
      const traitement: Partial<TraitementCas> = {};
      traitement.cas = await this.gestCasService.getOneCas(this.casId).toPromise();
      traitement.statutCas = statusCas;
      traitement.description = description;

      this.gestCasService.addTraitement(traitement).subscribe(
        () => {
          this.utils.showNotif('Statut modifié avec succès', 'success');
          this.isDone.emit(true);
        },
        err => {
          this.utils.showNotif(`Une erreur est survenue lors de l'opération ${err}`, 'danger')
        }
      )
    }
    return;
  }

}
