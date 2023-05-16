import { PERMISSIONS } from 'app/config/app.data';
import { AuthService } from 'app/mgf/auth/services/auth.service';
import { GestionCasService, VICTIME_URL } from './../../services/gestion-cas.service';
import { Observable } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { Victime } from '../../models/victime.model';

@Component({
  selector: 'app-info-victime',
  templateUrl: './info-victime.component.html',
  styleUrls: ['./info-victime.component.css']
})
export class InfoVictimeComponent implements OnInit {

  @Input() victimeId: number;
  victime$: Observable<Victime>;
  victimeUrl = VICTIME_URL;

  permissions = {
    can_edit: false
  }

  constructor(private gestCasService: GestionCasService,
              private auth: AuthService) { }

  ngOnInit(): void {
    this.setPermissions();
    this.victime$ = this.gestCasService.getOneVictime(this.victimeId)
  }

  setPermissions() {
    this.permissions = {
      can_edit: this.auth.getPermissions().includes(PERMISSIONS.CAN_UPDATE_VICTIME)
    }
  }

}
