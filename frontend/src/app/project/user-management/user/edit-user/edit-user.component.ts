import { USER_URL } from './../../services/user.service';
import { UtilService } from './../../../core/services/util.service';
import { LocaliteService } from './../../../core/services/localite.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import intlTelInput from 'intl-tel-input';

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
    this.initPhone();
    this.onEdit();
    this.loadInfos();
    this.onChangeSelectLocalite(); 
  }

  initForm() {
    this.userForm = new FormGroup(
      {
        nom: new FormControl("", Validators.required),
        prenom: new FormControl("", Validators.required),
        telephone: new FormControl('', [Validators.required, Validators.pattern(TEL_PATTERN)]),
        email: new FormControl(""),
        role: new FormControl("", Validators.required),
        region:  new FormControl(null),
        prefecture:  new FormControl(null),
        commune:  new FormControl(null),
        quartier:  new FormControl(null),
        secteur:  new FormControl(null),
        
      })
  }

  resetForm() {
    this.initForm();
    // this.userForm.markAsPristine();
    // this.userForm.markAsUntouched();
    // this.userForm.updateValueAndValidity();
  }

  async onSubmit($event) {
    if (!this.userForm.invalid) {
      $event.preventDefault();
      let data = { ...this.userForm.value };
      const userActions$ = this.isNew ? this.userService.add(data) : this.userService.update(this.userId, data);
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
    this.userForm.get('region').valueChanges.subscribe(region => {
      this.localiteService.subjectPrefecture.next(region.id);
    });

    this.userForm.get('prefecture').valueChanges.subscribe(prefecture => {
      this.localiteService.subjectCommune.next(prefecture.id);
    });

    this.userForm.get('commune').valueChanges.subscribe(commune => {
      this.localiteService.subjectQuartier.next(commune.id);
    });

    this.userForm.get('quartier').valueChanges.subscribe(quartier => {
      this.localiteService.subjectSecteur.next(quartier.id);
    });
  } 

  async mapUser() {
    const user = await this.userService.getOne(this.userId).toPromise();
    this.userForm.patchValue({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      telephone: user.telephone, 
      role: user.role,
      region: user.region,
      prefecture: user.prefecture,
      commune: user.commune,
      quartier: user.quartier,
      secteur:  user.secteur
    })
    this.userForm.patchValue({ role: user.role });
    // this.userForm.get('role').setValue(user.role); 
  }

  compareObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }

  onEdit() {
    if (!this.isNew && this.userId > 0) {
      this.mapUser();
    }
  }

  // Apres enregistrement d'un nouveau quartier dans le modal, MAJ du champs
  onNewQuartier(isDone: {done: boolean, id: number}) {
    if (isDone.done) {
      this.localiteService.getOneQuartier(isDone.id).subscribe((data) => {
        this.localiteService.subjectQuartier.next(data.commune.id);
        this.userForm.get('quartier').setValue(data);
        this.modalReference.close();
      },error => console.log(error))
    }
  }

  // Apres enregistrement d'un nouveau secteur dans le modal, MAJ du champs
  onNewSecteur(isDone: {done: boolean, id: number}) {
    if (isDone.done) {
      this.localiteService.getOneSecteur(isDone.id).subscribe((data) => {
        this.localiteService.subjectSecteur.next(data.quartier.id);
        this.userForm.get('secteur').setValue(data);
        this.modalReference.close();
      },error => console.log(error))
    }
  }

  // Fonction permettant d'ouvrir un modal pour enregistrer un quartier ou un secteur
  onOpenModal(content: any, isSecteur= false) {
    if (isSecteur) {
      this.quartierId = this.userForm.get('quartier').value;
      if (!this.quartierId) {
        this.snackBar.open('Selectionnez un quartier', '', {duration: 3000, verticalPosition: 'top', horizontalPosition: 'right', panelClass: ['my-snack-warning']})
        return;
      }
    } else {
      this.communeId = this.userForm.get('commune').value;
      if (!this.communeId) {
        this.snackBar.open('Selectionnez une commune ou sous-prefecture', '', {duration: 3000, verticalPosition: 'top', horizontalPosition: 'right', panelClass: ['my-snack-warning']})
        return;
      }
    }
    this.modalReference = this.modalService.open(content, {backdrop: 'static', centered: true});
  }

  initPhone() {
    const input = document.querySelector("#phone");
    // Récupérer le champ email et sa taille
    const emailInput = document.querySelector("#email");
    const emailInputStyle = window.getComputedStyle(emailInput);
    const emailInputWidth = emailInputStyle.getPropertyValue("width");
    // Appliquer la taille au champ téléphone
    if (input instanceof HTMLInputElement) {
      input.style.width = emailInputWidth;
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
