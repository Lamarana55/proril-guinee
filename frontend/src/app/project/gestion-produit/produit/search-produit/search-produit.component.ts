import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
//import { EventEmitter } from 'protractor';
import { ParametrageService } from 'app/project/parametrage/services/parametrage.service';
import { RequestProduitParam } from '../../models/request.produit.model';
@Component({
  selector: 'app-search-produit',
  templateUrl: './search-produit.component.html',
  styleUrls: ['./search-produit.component.css']
})
export class SearchProduitComponent implements OnInit {
   
  @Input() isLoading = false;
  @Input() expanded = false;
  @Output() onSearchEvent = new EventEmitter<RequestProduitParam>();

  panelOpenState = false;
  params: RequestProduitParam;

  groupements$: any;

  constructor(
              private parametrageService: ParametrageService) { }

  ngOnInit(): void {
    /* const now = this.datePipe.transform(new Date(), DATE_FORMAT);*/
    this.params = {
      dateDebut: null,
      dateFin: null
    } 
    this.init();
  }
  
  init(){
    this.groupements$ = this.parametrageService.getGroupements();
  }

  onSearch() {
    
    if (this.params) {
      this.onSearchEvent.emit(this.params);
    }
  }

  resetForm() {
    this.params = {};
  }

}
