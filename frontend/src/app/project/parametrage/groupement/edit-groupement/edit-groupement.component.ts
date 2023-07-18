
import { UtilService } from './../../../core/services/util.service';
import { LocaliteService } from './../../../core/services/localite.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TEL_PATTERN, SELECT_NUMBER_PATTERN } from 'app/config/app.data';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Region } from 'app/project/core/models/region.model';
import { Prefecture } from 'app/project/core/models/prefecture.model';
import { Commune } from 'app/project/core/models/commune.model';
import { Quartier } from 'app/project/core/models/quartier.model';
import { GROUPEMENT_URL, ParametrageService } from '../../services/parametrage.service';
import { Groupement } from '../../models/Groupement.model';
import intlTelInput from 'intl-tel-input';
import { data } from 'jquery';

@Component({
  selector: 'app-edit-groupement',
  templateUrl: './edit-groupement.component.html',
  styleUrls: ['./edit-groupement.component.css']
})
export class EditGroupementComponent implements OnInit {
  
  isNew = true;
  groupementId = 0;

  groupementForm: FormGroup
  groupementUrl = GROUPEMENT_URL;

  regions$: Observable<Region[]>;
  prefectures$: Observable<Prefecture[]>;
  communes$: Observable<Commune[]>;
  quartiers$: Observable<Quartier[]>;

  modalReference: NgbModalRef;
  communeId: number;
  quartierId: number;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private parametrageService: ParametrageService,
              private localiteService: LocaliteService,
              private utils: UtilService,
              private snackBar: MatSnackBar,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.groupementId = this.route.snapshot.params['id'];
    this.isNew = isNaN(this.groupementId);
    this.initPhone();
    this.initForm();
    this.onEdit();
    this.loadInfos();
    this.onChangeSelectLocalite(); 
  }

  initForm() {
    this.groupementForm = new FormGroup({
      nom: new FormControl('', [Validators.required, Validators.minLength(2)]),
      telephone: new FormControl('', [Validators.required, Validators.pattern(TEL_PATTERN)]),
      marque: new FormControl('', [Validators.required, Validators.minLength(2)]),
      description: new FormControl('', [Validators.required, Validators.minLength(4)]),
      region: new FormControl(null),
      prefecture: new FormControl(null),
      commune: new FormControl(null),
      quartier: new FormControl(null),
    });
    
  }

  resetForm() {
    this.initForm();
    this.groupementForm.markAsPristine();
    this.groupementForm.markAsUntouched();
    this.groupementForm.updateValueAndValidity();
  }

  async onSubmit() {
    if (!this.groupementForm.invalid) {
      const groupement = this.groupementForm.value as Partial<Groupement>;
      groupement.region = groupement.region?.id ? await this.localiteService.getOneRegion(groupement.region?.id).toPromise(): null;
      groupement.prefecture = groupement.prefecture?.id ? await this.localiteService.getOnePrefecture(groupement.prefecture.id).toPromise() : null;
      groupement.commune = groupement.commune?.id ? await this.localiteService.getOnecommune(groupement.commune.id).toPromise() : null;
      groupement.quartier = groupement.quartier?.id ? await this.localiteService.getOneQuartier(groupement.quartier.id).toPromise() : null;
      const groupementActions$ = this.isNew ? this.parametrageService.addGroupement(groupement) : this.parametrageService.updateGroupement(this.groupementId, groupement);
      groupementActions$.subscribe(
        () => {
          this.initLoc();
          this.utils.showNotif('Operation effectuée avec succès', 'success');
          this.isNew ? this.resetForm() : this.router.navigate(['parametrages/groupements'])
        },
        (error) => {
            this.utils.showNotif(`Une erreur est survenue lors de l'opération `, 'danger')
        }
      )
    }
  }

  loadInfos() {
    this.regions$ = this.localiteService.getRegions$();
    this.prefectures$ = this.localiteService.getPrefectures$();
    this.communes$ = this.localiteService.getCommunes$();
    this.quartiers$ = this.localiteService.getQuartiers$();
    this.initLoc();
  }

  initLoc() {
    this.localiteService.subjectRegion.next(0);
    this.localiteService.subjectPrefecture.next(0);
    this.localiteService.subjectCommune.next(0);
    this.localiteService.subjectQuartier.next(0);
  }

  
  // Actualisation des champs de la localite en fonction des informations selectionnees
 onChangeSelectLocalite() {
    this.groupementForm.get('region').valueChanges.subscribe(region => {
      this.localiteService.subjectPrefecture.next(region.id);
    });

    this.groupementForm.get('prefecture').valueChanges.subscribe(prefecture => {
      this.localiteService.subjectCommune.next(prefecture.id);
    });

    this.groupementForm.get('commune').valueChanges.subscribe(commune => {
      this.localiteService.subjectQuartier.next(commune.id);
    });

    this.groupementForm.get('quartier').valueChanges.subscribe(quartier => {
      this.localiteService.subjectSecteur.next(quartier.id);
    });
  } 

  onChangeSelectRegion(){
    const selectedRegion = this.groupementForm.get('region').value;
    this.localiteService.subjectPrefecture.next(selectedRegion.id);
  }

  onChangeSelectPrefecture(){
    const selectedPrefecture = this.groupementForm.get('prefecture').value;
    this.localiteService.subjectCommune.next(selectedPrefecture.id);
  }

  onChangeSelectCommune(){
    const selectedCommune = this.groupementForm.get('commune').value;
    this.localiteService.subjectQuartier.next(selectedCommune.id);
  }

  async mapGroupement() {
    const groupement = await this.parametrageService.getOneGroupement(this.groupementId).toPromise();
    this.groupementForm.patchValue({
      nom: groupement.nom,
      telephone: groupement.telephone, 
      marque: groupement.marque,
      description: groupement.description,
      region: groupement.region,
      prefecture: groupement.prefecture,
      commune: groupement.commune,
      quartier: groupement.quartier,
    })
  }

  onEdit() {
    if (!this.isNew && this.groupementId > 0) {
      this.mapGroupement();
    }
  }

  // Apres enregistrement d'un nouveau quartier dans le modal, MAJ du champs
  onNewQuartier(isDone: {done: boolean, id: number}) {
    if (isDone.done) {
      this.localiteService.getOneQuartier(isDone.id).subscribe((data) => {
        this.localiteService.subjectQuartier.next(data.commune.id);
        this.groupementForm.get('quartier').setValue(data);
        this.modalReference.close();
      },error => console.log(error))
    }
  }

  // Fonction permettant d'ouvrir un modal pour enregistrer un quartier ou un secteur
  onOpenModal(content: any, isSecteur= false) {
    if (isSecteur) {
      this.quartierId = this.groupementForm.get('quartier').value;
      if (!this.quartierId) {
        this.snackBar.open('Selectionnez un quartier', '', {duration: 3000, verticalPosition: 'top', horizontalPosition: 'right', panelClass: ['my-snack-warning']})
        return;
      }
    } else {
      this.communeId = this.groupementForm.get('commune').value;
      if (!this.communeId) {
        this.snackBar.open('Selectionnez une commune ou sous-prefecture', '', {duration: 3000, verticalPosition: 'top', horizontalPosition: 'right', panelClass: ['my-snack-warning']})
        return;
      }
    }
    this.modalReference = this.modalService.open(content, {backdrop: 'static', centered: true});
  }


  initPhone() {
    const input = document.querySelector("#phone");
    // Récupérer le champ nom et sa taille
    const nomInput = document.querySelector("#nom");
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
