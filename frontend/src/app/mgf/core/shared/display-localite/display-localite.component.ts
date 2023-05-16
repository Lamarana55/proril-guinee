import { LOCALITE } from './../../../../config/app.data';
import { Localite } from './../../models/localite.model';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-display-localite',
  templateUrl: './display-localite.component.html',
  styleUrls: ['./display-localite.component.css']
})
export class DisplayLocaliteComponent implements OnInit {

  @Input() localite: Localite
  LOCALITES = LOCALITE;

  constructor() { }

  ngOnInit(): void {
  }

}
