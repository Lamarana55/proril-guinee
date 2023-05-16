import { SERVICE_URL } from './../../services/parametrage.service';
import { TypeCas } from './../../models/type-cas.model';
import { Question } from './../../models/question.model';
import { SELECT_NUMBER_PATTERN } from './../../../../config/app.data';
import { Observable, BehaviorSubject } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ParametrageService } from '../../services/parametrage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilService } from 'app/mgf/core/services/util.service';
import { finalize, switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.css']
})
export class EditQuestionComponent implements OnInit {

  isNew = true;
  questionId = 0;
  questionForm: FormGroup;

  parents$: Observable<Question[]>;
  parentSubject$ = new BehaviorSubject(0);
  typeCas$: Observable<TypeCas[]>;


  serviceUrl = SERVICE_URL;
  returnUrl = '..';
  isParent  = false;

  constructor(private fb: FormBuilder,
              private paramService: ParametrageService,
              private route: ActivatedRoute,
              private utils: UtilService,
              private router: Router) { }

  ngOnInit(): void {
    this.utils.previousUrl$.subscribe(url => {
      this.returnUrl = !!url ? url : this.returnUrl;
    })
    this.questionId = this.route.snapshot.params['id'];
    this.isNew = isNaN(this.questionId);
    this.initForm();

    if (!this.isNew) {
      this.mapQuestion();
    }
  }

  initForm() {
    this.questionForm = this.fb.group({
      typeCas: [null, Validators.pattern(SELECT_NUMBER_PATTERN)],
      libelle: ['', Validators.required],
      idParent: [null, Validators.pattern(SELECT_NUMBER_PATTERN)],
      statutParent: true,
      description: ''
    });

    this.isParent = false

    this.questionForm.controls.typeCas.valueChanges.subscribe(value => {
      if (value && !isNaN(value)) {
        this.parentSubject$.next(value);
      }
    })

    this.questionForm.controls.idParent.valueChanges.subscribe(value => {
      this.isParent = !!value;
    })

    this.parents$ = this.parentSubject$.asObservable().pipe(
      switchMap(idTypeCas => {
        if (idTypeCas === 0) {
          return this.paramService.getAllQuestions();
        }

        return this.paramService.getAllQuestions().pipe(
          map(questions => questions.filter(q => !q.typeCas || q.typeCas.id === idTypeCas))
        )
      })
    )
    this.typeCas$ = this.paramService.getAllTypeCas();
  }

  resetForm() {
    this.initForm();
    this.questionForm.markAsUntouched();
    this.questionForm.markAsPristine();
    this.questionForm.updateValueAndValidity();
  }

  async onSubmit() {
    if (this.questionForm.invalid) {
      const controls = this.questionForm.controls;
      Object.keys(controls).forEach(key => controls[key].markAsTouched())
      return;
    }
    const formValue = this.questionForm.value;
    const question: Partial<Question> = {};
    if (formValue.typeCas) {
      question.typeCas = await this.paramService.getOneTypeCas(formValue.typeCas).toPromise();
    }
    question.libelle = formValue.libelle;
    question.idParent = formValue.idParent;
    question.statutParent = !!question.idParent ? formValue.statutParent : null;
    question.description = formValue.description;

    // console.log('Question', question)

    const action$ = this.isNew ?
            this.paramService.addQuestion(question) :
              this.paramService.updateQuestion(this.questionId, question);

    action$.subscribe(
      () => {
        this.utils.showNotif('Operation effectuée avec succès', 'success');
        this.isNew ? this.resetForm() : this.router.navigate(['/parametrages/services'])
      },
      err => {
        this.utils.showNotif(`Une erreur est survenue lors de l'opération \n ${err}`, 'danger')
      }
    )
  }

  async mapQuestion() {
    const question = await this.paramService.getOneQuestion(this.questionId).toPromise();
    this.questionForm.patchValue({
      libelle: question.libelle,
      typeCas: question.typeCas ? question.typeCas.id : null,
      idParent: question.idParent,
      statutParent: question.statutParent,
      description: question.description
    })
  }

}
