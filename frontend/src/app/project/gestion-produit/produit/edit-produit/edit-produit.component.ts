
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DESCRIPTION_MINIMUM_LENGTH, SELECT_NUMBER_PATTERN } from 'app/config/app.data';
import { Observable } from 'rxjs';
import { UtilService } from './../../../core/services/util.service';
import { Groupement } from 'app/project/parametrage/models/Groupement.model';
import { GestionProduitService, PRODUIT_URL } from '../../services/gestion-produit.service';
import { ParametrageService } from 'app/project/parametrage/services/parametrage.service';
import { Categorie } from 'app/project/parametrage/models/categorie.model';
import { Produit } from '../../models/produit.model';

@Component({
  selector: 'app-edit-produit',
  templateUrl: './edit-produit.component.html',
  styleUrls: ['./edit-produit.component.css']
})
export class EditProduitComponent implements OnInit {


  isNew = true;
  produitId = 0;
  groupements$: Observable<Groupement[]>;
  categories$: Observable<Categorie[]>;

  produitForm: FormGroup
  produitUrl = PRODUIT_URL;

  description = DESCRIPTION_MINIMUM_LENGTH

  modalReference: NgbModalRef;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private parametrageService: ParametrageService,
              private gestionProduitService: GestionProduitService,
              private utils: UtilService,
              private snackBar: MatSnackBar,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.produitId = this.route.snapshot.params['id'];
    this.isNew = isNaN(this.produitId);
    this.groupements$ = this.parametrageService.getGroupements();
    this.categories$ = this.parametrageService.getAllCategories();
    this.initForm();
    this.onEdit();
  }

  initForm() {
    this.produitForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      poids: ['', [Validators.required, Validators.pattern(SELECT_NUMBER_PATTERN)]],
      prixUnit: ['', [Validators.required, Validators.pattern(SELECT_NUMBER_PATTERN)]],
      description: ['', [Validators.required, Validators.minLength(DESCRIPTION_MINIMUM_LENGTH)]],
      groupement: this.fb.group({
        id: [null, [Validators.required, Validators.pattern(SELECT_NUMBER_PATTERN)]]
      }),
      categorie: this.fb.group({
        id: [null, [Validators.required, Validators.pattern(SELECT_NUMBER_PATTERN)]]
      })
    });
  }

  resetForm() {
    this.initForm();
    this.produitForm.markAsPristine();
    this.produitForm.markAsUntouched();
    this.produitForm.updateValueAndValidity();
  }

  async onSubmit() {
    if (!this.produitForm.invalid) {
      const produit = this.produitForm.value as Partial<Produit>;
      produit.groupement = await this.parametrageService.getOneGroupement(produit.groupement.id).toPromise();
      produit.categorie = await this.parametrageService.getOneCategorie(produit.categorie.id).toPromise();

      const produitActions$ = this.isNew ? this.gestionProduitService.addProduit(produit) : this.gestionProduitService.updateProduit(this.produitId, produit);
      produitActions$.subscribe(
        () => {
          this.utils.showNotif('Operation effectuée avec succès', 'success');
          this.isNew ? this.resetForm() : this.router.navigate(['gestion-produits/produits'])
        },
        (error) => {
            this.utils.showNotif(`Une erreur est survenue lors de l'opération `, 'danger')
        }
      )
    }
  }

  async mapProduit() {
    const produit = await this.gestionProduitService.getOneproduit(this.produitId).toPromise();
    this.produitForm.patchValue({
      nom: produit.nom,
      poids: produit.poids,
      prixUnit: produit.prixUnit,
      description: produit.description,
      groupement: { id: produit.groupement.id },
      categorie: {id: produit.categorie.id}, 
    })
  }

  onEdit() {
    if (!this.isNew && this.produitId > 0) {
      this.mapProduit();
    }
  }
}
