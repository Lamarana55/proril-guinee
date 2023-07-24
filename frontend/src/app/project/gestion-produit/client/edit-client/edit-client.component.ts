
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DESCRIPTION_MINIMUM_LENGTH, SELECT_NUMBER_PATTERN, TEL_PATTERN } from 'app/config/app.data';
import { Observable } from 'rxjs';
import { UtilService } from './../../../core/services/util.service';
import { Groupement } from 'app/project/parametrage/models/Groupement.model';
import { ParametrageService } from 'app/project/parametrage/services/parametrage.service';
import { Categorie } from 'app/project/parametrage/models/categorie.model';
import { Client } from '../../models/client.model';
import { CLIENT_URL, GestionProduitService } from '../../services/gestion-produit.service';
import intlTelInput from 'intl-tel-input';
import { GlobalConstants } from 'app/global-constants';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.css']
})
export class EditClientComponent implements OnInit {


  isNew = true;
  clientId = 0;
  groupements$: Observable<Groupement[]>;
  categories$: Observable<Categorie[]>;

  clientForm: FormGroup
  clientUrl = CLIENT_URL;

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
    this.clientId = this.route.snapshot.params['id'];
    this.isNew = isNaN(this.clientId);
    this.initPhone();
    this.groupements$ = this.parametrageService.getGroupements();
    this.categories$ = this.parametrageService.getAllCategories();
    this.initForm();
    this.onEdit();
  }

  initForm() {
    this.clientForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      telephone: ['', [Validators.required, Validators.pattern('^6[2165][0-9]{7}$')]],
      adresse: ['', [Validators.minLength(DESCRIPTION_MINIMUM_LENGTH)]],
    }); 
  }

  resetForm() {
    this.initForm();
    this.clientForm.markAsPristine();
    this.clientForm.markAsUntouched();
    this.clientForm.updateValueAndValidity();
  }

  async onSubmit() {
    if (!this.clientForm.invalid) {
      const client = this.clientForm.value as Partial<Client>;
      
      const clientActions$ = this.isNew ? this.gestionProduitService.addClient(client) : this.gestionProduitService.updateClient(this.clientId, client);
      clientActions$.subscribe(
        () => {
          this.utils.showNotif('Operation effectuée avec succès', 'success');
          this.isNew ? this.resetForm() : this.router.navigate(['gestion-produits/clients'])
        },
        (error) => {
            this.utils.showNotif(`Une erreur est survenue lors de l'opération `, 'danger')
        }
      )
    }
  }

  async mapclient() {
    const client = await this.gestionProduitService.getOneClient(this.clientId).toPromise();
    this.clientForm.patchValue({
      nom: client.nom,
      prenom: client.prenom,
      telephone: client.telephone,
      adresse: client.adresse
    })
  }

  onEdit() {
    if (!this.isNew && this.clientId > 0) {
      this.mapclient();
    }
  }

  initPhone() {
    const input = document.querySelector("#phone");
    // Récupérer le champ nom et sa taille
    const nomInput = document.querySelector("#prenom");
    const nomInputStyle = window.getComputedStyle(nomInput);
    const nomInputWidth = nomInputStyle.getPropertyValue("width");
    // Appliquer la taille au champ téléphone
    if (input instanceof HTMLInputElement) {
      input.style.width = nomInputWidth;
    }

    // Appliquer le gn au champ téléphone
    if (input) {
      const iti = intlTelInput(input, {
        initialCountry: "gn",
        separateDialCode: true,
        autoPlaceholder: "polite",
        nationalMode: false,
        formatOnDisPROFESSIONplay: false,
        customPlaceholder: function (
          selectedCountryPlaceholder,
          selectedCountryData
        ) {
          return "Ex: " + selectedCountryPlaceholder;
        },
      });
    }
  }
}
