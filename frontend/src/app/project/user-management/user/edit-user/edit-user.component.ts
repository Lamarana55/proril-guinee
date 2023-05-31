import { USER_URL } from './../../services/user.service';
import { UtilService } from './../../../core/services/util.service';
import { LocaliteService } from './../../../core/services/localite.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Role } from '../../models/role.model';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { TEL_PATTERN, SELECT_NUMBER_PATTERN } from 'app/config/app.data';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Region } from 'app/project/core/models/region.model';
import { Prefecture } from 'app/project/core/models/prefecture.model';
import { Commune } from 'app/project/core/models/commune.model';
import { Quartier } from 'app/project/core/models/quartier.model';
import { Secteur } from 'app/project/core/models/secteur.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  isNew = true;
  userId = 0;
  roles$: Observable<Role[]>;

  userForm: FormGroup
  userUrl = USER_URL;

  regions$: Observable<Region[]>;
  prefectures$: Observable<Prefecture[]>;
  communes$: Observable<Commune[]>;
  quartiers$: Observable<Quartier[]>;
  secteurs$: Observable<Secteur[]>;

  modalReference: NgbModalRef;
  communeId: number;
  quartierId: number;

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private localiteService: LocaliteService,
              private utils: UtilService,
              private snackBar: MatSnackBar,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];
    this.isNew = isNaN(this.userId);
    this.roles$ = this.userService.getAllRoles();
    this.initForm();
    this.onEdit();
    this.loadInfos();
    this.onChangeSelectLocalite(); 
  }

  initForm() {
    this.userForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
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
      secteur: this.fb.group({
        id: [null, [Validators.pattern(SELECT_NUMBER_PATTERN)]]
      }),
      telephone: ['', [Validators.required, Validators.pattern(TEL_PATTERN)]],
      role: this.fb.group({
        id: [null, [Validators.required, Validators.pattern(SELECT_NUMBER_PATTERN)]]
      })
    });
  }

  resetForm() {
    this.initForm();
    this.userForm.markAsPristine();
    this.userForm.markAsUntouched();
    this.userForm.updateValueAndValidity();
  }

  async onSubmit() {
    if (!this.userForm.invalid) {
      const user = this.userForm.value as Partial<User>;
      user.role = await this.userService.getOneRole(user.role.id).toPromise();
      user.region = user.region.id ? await this.localiteService.getOneRegion(user.region.id).toPromise() : null;
      user.prefecture = user.prefecture.id ? await this.localiteService.getOnePrefecture(user.prefecture.id).toPromise(): null;
      user.commune = user.commune.id ? await this.localiteService.getOnecommune(user.commune.id).toPromise() : null;
      user.quartier =  user.quartier.id ? await this.localiteService.getOneQuartier(user.quartier.id).toPromise() : null;
      user.secteur = user.secteur.id ? await this.localiteService.getOneSecteur(user.secteur.id).toPromise() : null;

      const userActions$ = this.isNew ? this.userService.add(user) : this.userService.update(this.userId, user);
      userActions$.subscribe(
        () => {
          this.initLoc();
          this.utils.showNotif('Operation effectuée avec succès', 'success');
          this.isNew ? this.resetForm() : this.router.navigate(['users'])
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
    this.secteurs$ = this.localiteService.getSecteurs$();
    this.initLoc();
  }

  initLoc() {
    this.localiteService.subjectRegion.next(0);
    this.localiteService.subjectPrefecture.next(0);
    this.localiteService.subjectCommune.next(0);
    this.localiteService.subjectQuartier.next(0);
    this.localiteService.subjectSecteur.next(0);
  }

  // Actualisation des champs de la localite en fonction des informations selectionnees
 onChangeSelectLocalite() {
    this.userForm.get('region.id').valueChanges.subscribe(id => {
      this.localiteService.subjectPrefecture.next(id);
    });

    this.userForm.get('prefecture.id').valueChanges.subscribe(idPrefecture => {
      this.localiteService.subjectCommune.next(idPrefecture);
    });

    this.userForm.get('commune.id').valueChanges.subscribe(idCommune => {
      this.localiteService.subjectQuartier.next(idCommune);
    });

    this.userForm.get('quartier.id').valueChanges.subscribe(idQuartier => {
      this.localiteService.subjectSecteur.next(idQuartier);
    });
  } 

  async mapUser() {
    const user = await this.userService.getOne(this.userId).toPromise();

    this.userForm.patchValue({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      telephone: user.telephone, 
      role: { id: user.role.id },
      /* region: user.region.id ? { id: user.region.id } : null,
      prefecture: user.prefecture.id ? {id: user.prefecture.id} : null,
      commune: user.commune.id ? {id: user.commune.id} : null,
      quartier: user.quartier.id ? {id: user.quartier.id} : null,
      secteur:  user.secteur.id ? {id: user.secteur.id}: null */
    })
  }

  onEdit() {
    if (!this.isNew && this.userId > 0) {
      this.mapUser();
    }
  }

  // Apres enregistrement d'un nouveau quartier dans le modal, MAJ du champs
  onNewQuartier(isDone: {done: boolean, id: number}) {
    if (isDone.done) {
      this.localiteService.subjectQuartier.next(this.communeId);
      this.userForm.get('quartier.id').setValue(isDone.id);
      this.modalReference.close();
    }
  }

  // Apres enregistrement d'un nouveau secteur dans le modal, MAJ du champs
  onNewSecteur(isDone: {done: boolean, id: number}) {
    if (isDone.done) {
      this.localiteService.subjectSecteur.next(this.quartierId);
      this.userForm.get('secteur.id').setValue(isDone.id);
      this.modalReference.close();
    }
  }

  // Fonction permettant d'ouvrir un modal pour enregistrer un quartier ou un secteur
  onOpenModal(content: any, isSecteur= false) {
    if (isSecteur) {
      this.quartierId = this.userForm.get('quartier.id').value;
      if (!this.quartierId) {
        this.snackBar.open('Selectionnez un quartier', '', {duration: 3000, verticalPosition: 'top', horizontalPosition: 'right', panelClass: ['my-snack-warning']})
        return;
      }
    } else {
      this.communeId = this.userForm.get('commune.id').value;
      if (!this.communeId) {
        this.snackBar.open('Selectionnez une commune ou sous-prefecture', '', {duration: 3000, verticalPosition: 'top', horizontalPosition: 'right', panelClass: ['my-snack-warning']})
        return;
      }
    }
    this.modalReference = this.modalService.open(content, {backdrop: 'static', centered: true});
  }

}
