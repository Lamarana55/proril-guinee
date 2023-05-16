import { AuthService } from 'app/mgf/auth/services/auth.service';
import { UtilService } from './../../../core/services/util.service';
import { ParametrageService, SERVICE_URL } from './../../services/parametrage.service';
import { switchMap, map, tap, finalize } from 'rxjs/operators';
import { Question } from './../../models/question.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { PERMISSIONS } from 'app/config/app.data';
import { Confirmable } from 'app/mgf/core/decorators/confirmable.decorator';

@Component({
  selector: 'app-list-question',
  templateUrl: './list-question.component.html',
  styleUrls: ['./list-question.component.css']
})
export class ListQuestionComponent implements OnInit {

  questions$: Observable<Question[]>;
  subject$ = new BehaviorSubject(0);

  serviceUrl = SERVICE_URL;
  page = 1;
  pageSize = 10;

  permissions = {
    can_add: false,
    can_edit: false,
    can_delete: false
  }

  constructor(private paramService: ParametrageService,
              private utils: UtilService,
              private auth: AuthService) { }

  ngOnInit(): void {
    this.questions$ = this.subject$.asObservable().pipe(
      switchMap(() => this.paramService.getAllQuestions())
    )
    this.setPermissions();
  }

  @Confirmable({html: 'Voulez-vous supprimer ce service ?', icon: 'warning'})
  onDeleteOne(idQuestion: number) {
    this.paramService.deleteQuestion(idQuestion).subscribe(
      () => {
        this.utils.showNotif('Service supprimé avec succès', 'success');
        this.subject$.next(1);
      },
      err => {
        this.utils.showNotif(`Une erreur est survenue lors de l\'opération ${err}`, 'danger')
      }
    )
  }

  getQuestion(id: number) {
    return this.paramService.getOneQuestion(id)
  }

  onRefresh() {
    this.subject$.next(1);
  }

  setPermissions() {
    const authPermissions = this.auth.getPermissions();
    this.permissions = {
      can_add: authPermissions.includes(PERMISSIONS.CAN_ADD_QUESTION),
      can_edit: authPermissions.includes(PERMISSIONS.CAN_UPDATE_QUESTION),
      can_delete: authPermissions.includes(PERMISSIONS.CAN_DELETE_QUESTION)
    }
  }

}
