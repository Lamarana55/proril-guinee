import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs/operators';
import { Quartier } from '../../models/quartier.model';
import { LocaliteService } from '../../services/localite.service';
import { Secteur } from '../../models/secteur.model';

@Component({
  selector: 'app-secteur',
  templateUrl: './secteur.component.html',
  styleUrls: ['./secteur.component.css']
})
export class SecteurComponent implements OnInit, OnChanges {

  @Input() isNew = true;
  @Input() secteurId = 0;
  @Input() quartierId: number;
  @Output() isDone = new EventEmitter<{done: boolean, id: number}>();

  quartier$: Observable<Quartier>;
  subjectQuartier = new BehaviorSubject(0);

  secteurForm: FormGroup;

  constructor(private fb: FormBuilder,
              private localiteService: LocaliteService,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.quartier$ = this.subjectQuartier.asObservable().pipe(
      switchMap(id => {
        if (id === 0) {
          return of(new Quartier())
        } else {
          return this.localiteService.getOneQuartier(id);
        }
      })
    );

    this.initForm();
  }

  async onSubmit() {
    if (!this.secteurForm.invalid) {
      const secteur: Partial<Secteur> = this.secteurForm.value;
      secteur.quartier = await this.localiteService.getOneQuartier(this.quartierId).toPromise();
      if (this.isNew) {
        this.localiteService.addSecteur(secteur).subscribe(
          data => {
            this.snackBar.open('Enregistré avec succès', 'Enregistrement', {duration: 5000, verticalPosition: 'top', panelClass: ['my-snack-success']});
            this.resetForm();
            this.isDone.emit({done: true, id: data.id});
          },

          err => {
            this.snackBar.open('Une erreur est survenue lors de l\'enregistrement ' + err,
              'Enregistrement', {duration: 5000, verticalPosition: 'top', panelClass: ['my-snack-warning']});
          }
        )
      } else {
        secteur.id = this.secteurId;
        this.localiteService.updateSecteur(secteur).subscribe(
          data => {
            this.snackBar.open('Modifié avec succès', 'Modification', {duration: 5000, verticalPosition: 'top', panelClass: ['my-snack-success']});
            this.resetForm();
            this.isDone.emit({done: true, id: data.id});
          },

          err => {
            this.snackBar.open('Une erreur est survenue lors de la modificationv' + err,
              'Modification', {duration: 5000, verticalPosition: 'top', panelClass: ['my-snack-warning']});
          }
        )
      }
    }
  }

  initForm() {
    this.secteurForm = this.fb.group({
      nom: ['', Validators.required],
      description: ''
    })
  }

  resetForm() {
    this.initForm();
    this.secteurForm.markAsPristine();
    this.secteurForm.markAsUntouched();
    this.secteurForm.updateValueAndValidity();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.quartierId.previousValue !== changes.quartierId.currentValue) {
      this.subjectQuartier.next(this.quartierId);
    }
    if (!changes.isNew.currentValue && changes.secteurId.currentValue > 0) {
      this.mapSecteur();
    }
  }

  async mapSecteur() {
    const secteur = await this.localiteService.getOneSecteur(this.secteurId).toPromise();
    this.secteurForm.patchValue({
      nom: secteur.nom,
      description: secteur.description
    });
  }

}
