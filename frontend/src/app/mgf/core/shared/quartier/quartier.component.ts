import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Commune } from '../../models/commune.model';
import { Quartier } from '../../models/quartier.model';
import { LocaliteService } from '../../services/localite.service';

@Component({
  selector: 'app-quartier',
  templateUrl: './quartier.component.html',
  styleUrls: ['./quartier.component.css']
})
export class QuartierComponent implements OnInit, OnChanges {

  @Input() isNew = true;
  @Input() quartierId = 0;
  @Input() communeId: number;
  @Output() isDone = new EventEmitter<{done: boolean, id: number}>();

  commune$: Observable<Commune>;
  subjectCommune = new BehaviorSubject(0);

  quartierForm: FormGroup;

  constructor(private fb: FormBuilder,
              private localiteService: LocaliteService,
              private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.commune$ = this.subjectCommune.asObservable().pipe(
      switchMap(id => {
        if (id === 0) {
          return of(new Commune())
        } else {
          return this.localiteService.getOnecommune(id);
        }
      })
    );

    this.initForm();
  }

  async onSubmit() {
    if (this.quartierForm.invalid) {
      return;
    } else {
      const quartier: Partial<Quartier> = this.quartierForm.value;
      quartier.commune = await this.localiteService.getOnecommune(this.communeId).toPromise();
      if (this.isNew) {
        this.localiteService.addQuartier(quartier).subscribe(
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
        quartier.id = this.quartierId;
        this.localiteService.updateQuartier(quartier).subscribe(
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
    // const numOnly = /^[1-9]+$/;
    this.quartierForm = this.fb.group({
      nom: ['', Validators.required],
      description: ''
    })
  }

  resetForm() {
    this.initForm();
    this.quartierForm.markAsPristine();
    this.quartierForm.markAsUntouched();
    this.quartierForm.updateValueAndValidity();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.communeId.previousValue !== changes.communeId.currentValue) {
      this.subjectCommune.next(this.communeId);
    }
    if (!changes.isNew.currentValue && changes.quartierId.currentValue > 0) {
      this.mapQuartier();
    }
  }

  async mapQuartier() {
    const quartier = await this.localiteService.getOneQuartier(this.quartierId).toPromise();
    this.quartierForm.patchValue({
      nom: quartier.nom,
      description: quartier.description
    });
  }

}
