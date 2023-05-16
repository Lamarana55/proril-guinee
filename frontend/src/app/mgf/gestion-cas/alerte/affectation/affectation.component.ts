import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SELECT_NUMBER_PATTERN } from 'app/config/app.data';
import { UtilService } from 'app/mgf/core/services/util.service';
import { User } from 'app/mgf/user-management/models/user.model';
import { UserService } from 'app/mgf/user-management/services/user.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Alerte } from './../../models/alerte.model';
import { ALERTE_URL, GestionCasService } from './../../services/gestion-cas.service';
import { OPTION_GET_USER } from 'app/config/app.data';


const mapper = (user: User) => {
  return {
    id: user.id,
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    localite: user.localite,
    telephone: user.telephone,
    username: user.username,
    password: user.password,
    statut: user.statut,
    role: user.role,
    fonction: user.fonction 
  } as User
};
@Component({
  selector: 'app-affectation',
  templateUrl: './affectation.component.html',
  styleUrls: ['./affectation.component.css']
})
export class AffectationComponent implements OnInit, OnChanges {

  @Input() alerteId: number
  @Output() isDone = new EventEmitter<{done: boolean, alerte: Alerte}>();

  alerte$: Observable<Alerte>;
  users$: Observable<User[]>;
  userSubject$ = new BehaviorSubject(0);
  users: User[];
  affectationForm: FormGroup;

  alerteUrl = ALERTE_URL;
  optionUser = ["TOUT", "REGION", "PREFECTURE"];

  constructor(private gestCasService: GestionCasService,
              private userService: UserService,
              private utils: UtilService,
              private cdrf: ChangeDetectorRef
              ) { }

  ngOnInit(): void {
    this.initForm();
   
    this.mapValues()
    // this.getElement()

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.alerteId.currentValue > 0) {
      this.mapValues();
    }
  }

  ngAfterContentChecked() {
    this.cdrf.detectChanges();
  }
  
  onSubmit() {
    if (this.affectationForm.valid) {
      const {userId} = this.affectationForm.value;
      this.gestCasService.affecteAlerte(this.alerteId, userId).subscribe(
        updAlerte => {
          this.utils.showNotif('Effectué avec succès', 'success');
          this.resetForm();
          this.isDone.emit({done: true, alerte: updAlerte});
        },
        err => this.utils.showNotif(`Une erreur est survenue  lors de l'opération ${err}`, 'danger')
      )
    }
    return;
  }

  getElement(id: number, option: string){
    this.userService.getAllUsersAffectation(id, option).subscribe( data => { 
      this.users = data.map(mapper)
    })
  }
  
  initForm() {
    this.affectationForm = new FormGroup({
      userId: new FormControl(null, [Validators.required, Validators.pattern(SELECT_NUMBER_PATTERN)]),
      option: new FormControl('', Validators.required)
    }); 
  }

  resetForm() {
    this.initForm();
    this.affectationForm.markAsUntouched();
    this.affectationForm.markAsPristine();
    this.affectationForm.updateValueAndValidity();
  }

  onSelectLocaliteChange(){
    const option = this.affectationForm.value.option;
    if(option === OPTION_GET_USER.TOUT){
      console.log();
      
      
    }else  if(option === OPTION_GET_USER.REGION){
      console.log("Region: ", option);
      
    }else  if(option === OPTION_GET_USER.PREFECTURE){
      console.log("Prefecture: ", option);
      
    }
  }

  mapValues() {
    this.alerte$ = this.gestCasService.getOneAlerte(this.alerteId).pipe(
      tap(alerte => {
        const id = alerte.commune ? alerte.commune.id : 0;
        const idPrefecture = alerte.commune ? alerte.commune.prefecture.id : 0;
        // this.userSubject$.next(idCommune)
        this.affectationForm.patchValue({
          userId: alerte.user ? alerte.user.id : null
        })
        this.getElement(id, this.affectationForm.value.option);
      })
    )
  }

}
