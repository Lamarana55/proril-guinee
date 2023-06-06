
import { UtilService } from './../../../core/services/util.service';
import { LocaliteService } from './../../../core/services/localite.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TEL_PATTERN, SELECT_NUMBER_PATTERN } from 'app/config/app.data';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Region } from 'app/project/core/models/region.model';
import { Prefecture } from 'app/project/core/models/prefecture.model';
import { Commune } from 'app/project/core/models/commune.model';
import { Quartier } from 'app/project/core/models/quartier.model';
import { Secteur } from 'app/project/core/models/secteur.model';
import { GROUPEMENT_URL, ParametrageService } from '../../services/parametrage.service';
import { Groupement } from '../../models/Groupement.model';

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
    this.initForm();
    this.onEdit();
    this.loadInfos();
    this.onChangeSelectLocalite(); 
  }

  initForm() {
    this.groupementForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      telephone: ['', [Validators.required, Validators.pattern(TEL_PATTERN)]],
      email: ['', [Validators.required, Validators.email]],
      description: ['', [Validators.required, Validators.minLength(4)]],
      region: this.fb.group({id: [null, [Validators.pattern(SELECT_NUMBER_PATTERN)]]}),
      prefecture: this.fb.group({
        id: [null, [Validators.pattern(SELECT_NUMBER_PATTERN)]]
      }),
      commune: this.fb.group({
        id: [null, [Validators.pattern(SELECT_NUMBER_PATTERN)]]
      }),
      quartier: this.fb.group({
        id: [null, [Validators.pattern(SELECT_NUMBER_PATTERN)]]
      }),
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
      groupement.region =  await this.localiteService.getOneRegion(groupement.region?.id).toPromise();
      groupement.prefecture = await this.localiteService.getOnePrefecture(groupement.prefecture.id).toPromise();
      groupement.commune = await this.localiteService.getOnecommune(groupement.commune.id).toPromise();
      groupement.quartier =  await this.localiteService.getOneQuartier(groupement.quartier.id).toPromise();
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
    this.groupementForm.get('region.id').valueChanges.subscribe(id => {
      this.localiteService.subjectPrefecture.next(id);
    });

    this.groupementForm.get('prefecture.id').valueChanges.subscribe(idPrefecture => {
      this.localiteService.subjectCommune.next(idPrefecture);
    });

    this.groupementForm.get('commune.id').valueChanges.subscribe(idCommune => {
      this.localiteService.subjectQuartier.next(idCommune);
    });

    this.groupementForm.get('quartier.id').valueChanges.subscribe(idQuartier => {
      this.localiteService.subjectSecteur.next(idQuartier);
    });
  } 

  async mapGroupement() {
    const groupement = await this.parametrageService.getOneGroupement(this.groupementId).toPromise();
    this.groupementForm.patchValue({
      nom: groupement.nom,
      telephone: groupement.telephone, 
      email: groupement.email,
      description: groupement.description,
      region:  {id: groupement.region.id},
      prefecture: {id: groupement.prefecture.id} ,
      commune: {id: groupement.commune.id},
      quartier: {id: groupement.quartier.id},
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
      this.localiteService.subjectQuartier.next(this.communeId);
      this.groupementForm.get('quartier.id').setValue(isDone.id);
      this.modalReference.close();
    }
  }

  // Fonction permettant d'ouvrir un modal pour enregistrer un quartier ou un secteur
  onOpenModal(content: any, isSecteur= false) {
    if (isSecteur) {
      this.quartierId = this.groupementForm.get('quartier.id').value;
      if (!this.quartierId) {
        this.snackBar.open('Selectionnez un quartier', '', {duration: 3000, verticalPosition: 'top', horizontalPosition: 'right', panelClass: ['my-snack-warning']})
        return;
      }
    } else {
      this.communeId = this.groupementForm.get('commune.id').value;
      if (!this.communeId) {
        this.snackBar.open('Selectionnez une commune ou sous-prefecture', '', {duration: 3000, verticalPosition: 'top', horizontalPosition: 'right', panelClass: ['my-snack-warning']})
        return;
      }
    }
    this.modalReference = this.modalService.open(content, {backdrop: 'static', centered: true});
  }
}
