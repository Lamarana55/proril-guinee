import { PERMISSIONS } from 'app/config/app.data';
import { AuthService } from 'app/mgf/auth/services/auth.service';
import { ListTraitementComponent } from './../traitement/list-traitement/list-traitement.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Localite } from './../../../core/models/localite.model';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { GestionCasService, CAS_URL } from './../../services/gestion-cas.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Cas } from '../../models/cas.model';

@Component({
  selector: 'app-info-cas',
  templateUrl: './info-cas.component.html',
  styleUrls: ['./info-cas.component.css']
})
export class InfoCasComponent implements OnInit {

  casId: number;
  cas$: Observable<Cas>;
  subjectCas$ = new BehaviorSubject(0);

  statut = '';
  localite: Localite;
  victimeId: number;

  returnUrl = '../..';
  casUrl = CAS_URL;

  modalRef: NgbModalRef;

  panelOpenState = false

  permissions = { can_update_status: false };

  @ViewChild(ListTraitementComponent) traitementComponent: ListTraitementComponent;

  constructor(private gestCasService: GestionCasService,
              private auth: AuthService,
              private route: ActivatedRoute,
              private modalService: NgbModal) { }

  ngOnInit(): void {
    this.setPermissions();
    this.casId = this.route.snapshot.params['id'];
    /* this.utils.previousUrl$.subscribe(url => {
      this.returnUrl = !!url ? url : this.returnUrl;
    }); */

    this.cas$ = this.subjectCas$.asObservable().pipe(
      switchMap(() => this.gestCasService.getOneCas(this.casId).pipe(
        tap(cas => {
          this.statut = cas.statut;
          this.victimeId = cas.victime ? cas.victime.id : null;
          this.localite = cas.localite;
        })
      ))
    )
  }

  onOpenTraitementModal(content: any) {
    this.modalRef = this.modalService.open(content, {backdrop: 'static', windowClass: 'fadInModal'})
  }

  onCloseModal(isDone = false) {
    if (isDone) {
      this.modalRef.close();
      this.subjectCas$.next(1);
      this.traitementComponent.initData();
    }
  }

  setPermissions() {
    const permissions = this.auth.getPermissions();
    this.permissions = { can_update_status: permissions.includes(PERMISSIONS.CAN_UPDATE_CAS_STATUS) }
  }

}
