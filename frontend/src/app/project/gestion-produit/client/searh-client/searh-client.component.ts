import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { LOCALITE } from 'app/config/app.data';
//import { EventEmitter } from 'protractor';
import { UserService } from 'app/project/user-management/services/user.service';
import { RequestClientParam } from '../../models/request-client-param';
import { GestionProduitService } from '../../services/gestion-produit.service';
import intlTelInput from 'intl-tel-input';

@Component({
  selector: 'app-searh-client',
  templateUrl: './searh-client.component.html',
  styleUrls: ['./searh-client.component.css']
})
export class SearhClientComponent implements OnInit {
 
  @Input() isLoading = false;
  @Input() expanded = false;
  @Output() onSearchEvent = new EventEmitter<RequestClientParam>();

  panelOpenState = false;
  params: RequestClientParam;
  localites = LOCALITE;


  constructor(private gestionProduitService: GestionProduitService, private UserService: UserService) { }

  ngOnInit(): void {
    /* const now = this.datePipe.transform(new Date(), DATE_FORMAT);*/
    this.params = {nom : null, prenom: null}
    this.initPhone();

  }
  
  init(){
    this.UserService.getAll()
  }
  onSearch() {
    
    if (this.params) {
      this.onSearchEvent.emit(this.params);
    }
  }

  resetForm() {
    this.params = {};
  }


  initPhone() {
    const input = document.querySelector("#phone");
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
