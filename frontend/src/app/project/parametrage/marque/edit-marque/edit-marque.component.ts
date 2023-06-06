
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DESCRIPTION_MINIMUM_LENGTH, SELECT_NUMBER_PATTERN } from 'app/config/app.data';
import { Commune } from 'app/project/core/models/commune.model';
import { Prefecture } from 'app/project/core/models/prefecture.model';
import { Quartier } from 'app/project/core/models/quartier.model';
import { Region } from 'app/project/core/models/region.model';
import { Secteur } from 'app/project/core/models/secteur.model';
import { Observable } from 'rxjs';
import { Groupement } from '../../models/Groupement.model';
import { Marque } from '../../models/marque.model';
import { MARQUE_URL, ParametrageService } from '../../services/parametrage.service';
import { LocaliteService } from './../../../core/services/localite.service';
import { UtilService } from './../../../core/services/util.service';
@Component({
  selector: 'app-edit-marque',
  templateUrl: './edit-marque.component.html',
  styleUrls: ['./edit-marque.component.css']
})
export class EditMarqueComponent implements OnInit {

  isNew = true;
  marqueId = 0;
  groupements$: Observable<Groupement[]>;

  marqueForm: FormGroup
  marqueUrl = MARQUE_URL;

  description = DESCRIPTION_MINIMUM_LENGTH

  modalReference: NgbModalRef;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private parametrageService: ParametrageService,
              private utils: UtilService,
              private snackBar: MatSnackBar,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.marqueId = this.route.snapshot.params['id'];
    this.isNew = isNaN(this.marqueId);
    this.groupements$ = this.parametrageService.getGroupements();
    this.initForm();
    this.onEdit();
  }

  initForm() {
    this.marqueForm = this.fb.group({
      libelle: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(DESCRIPTION_MINIMUM_LENGTH)]],
      groupement: this.fb.group({
        id: [null, [Validators.required, Validators.pattern(SELECT_NUMBER_PATTERN)]]
      })
    });
  }

  resetForm() {
    this.initForm();
    this.marqueForm.markAsPristine();
    this.marqueForm.markAsUntouched();
    this.marqueForm.updateValueAndValidity();
  }

  async onSubmit() {
    if (!this.marqueForm.invalid) {
      const marque = this.marqueForm.value as Partial<Marque>;
      marque.groupement = await this.parametrageService.getOneGroupement(marque.groupement.id).toPromise();

      const marqueActions$ = this.isNew ? this.parametrageService.addMarque(marque) : this.parametrageService.updateMarque(this.marqueId, marque);
      marqueActions$.subscribe(
        () => {
          this.utils.showNotif('Operation effectuée avec succès', 'success');
          this.isNew ? this.resetForm() : this.router.navigate(['parametrages/marques'])
        },
        (error) => {
            this.utils.showNotif(`Une erreur est survenue lors de l'opération `, 'danger')
        }
      )
    }
  }

  async mapMarque() {
    const marque = await this.parametrageService.getOneMarque(this.marqueId).toPromise();
    this.marqueForm.patchValue({
      libelle: marque.libelle,
      description: marque.description,
      groupement: { id: marque.groupement.id },
    })
  }

  onEdit() {
    if (!this.isNew && this.marqueId > 0) {
      this.mapMarque();
    }
  }

}
