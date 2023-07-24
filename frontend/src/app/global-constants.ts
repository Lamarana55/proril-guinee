import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
declare var $: any;
export class GlobalConstants {
  public static IP_ADRESS: string = "localhost:9600";
  public static API_URL: string = `http://${GlobalConstants.IP_ADRESS}/api/`;
  public static FILE_BASE_URL: string = `http://${GlobalConstants.IP_ADRESS}`;

  public static WEBSOCKET_URL: string = `ws://${GlobalConstants.IP_ADRESS}/ws/notification/`
  public static WEBSOCKET_URLS: string = `wss://${GlobalConstants.IP_ADRESS}/ws/notification/`
  // for user

  public static LOGIN_URL = `${GlobalConstants.API_URL}login/`;
  public static USERS_URL = `${GlobalConstants.API_URL}users/`;
  public static REGISTER_URL = `${GlobalConstants.API_URL}register/`;
  public static REGISTER_ENTREPRISE_URL = `${GlobalConstants.API_URL}register-entreprise/`;
  public static TYPE_USER_ADD_URL = `${GlobalConstants.API_URL}type-user-add/`;
  public static SERVICE_ADD_URL = `${GlobalConstants.API_URL}service-add/`;
  public static PASSWORDRESETEMAIL_URL = `${GlobalConstants.API_URL}reset-email-password/`;
  // url pour creer les actions
  public static TRACK_ACTION_ADD_URL = `${GlobalConstants.API_URL}action_track/`;
  public static TYPE_USER_LIST_URL = `${GlobalConstants.API_URL}type-user-list/`;
  public static USER_URL = `${GlobalConstants.API_URL}user/`;
  public static SINGLE_USER_URL = `${GlobalConstants.API_URL}user/`;
  public static CHANGE_PASSWORD_URL = `${GlobalConstants.API_URL}change-password/`;
  public static UPDATE_USER_URL = `${GlobalConstants.API_URL}update-user/`;
  public static RESET_PASSWORD_URL = `${GlobalConstants.API_URL}reset-password/`;
  public static REQUEST_RESET_USER_PASSWORD_URL = `${GlobalConstants.API_URL}req-reset-password/`;
  public static USER_DETAIL_URL = `${GlobalConstants.API_URL}user-detail/`;
  public static GET_SERVICES = `${GlobalConstants.API_URL}all-services/`;
  public static GET_SERVICE_BY_ID = `${GlobalConstants.API_URL}get-service/`;
  public static DEL_SERVICE_BY_ID = `${GlobalConstants.API_URL}del-service/`;
  public static SERVICE_EDIT = `${GlobalConstants.API_URL}edit-service/`;

  // notification
  public static NOTIFICATION_URL = `${GlobalConstants.API_URL}notifications`;
  // une seule notification
  public static UPDATENOTIFICATION_URL = `${GlobalConstants.API_URL}notifications/update/`;

  // for logoout REQUEST_LOGOUT_USER 
  public static REQUEST_LOGOUT_USER = `${GlobalConstants.API_URL}deconnexion/`;
  // public static REQUEST_LOGIN_USER = `${GlobalConstants.API_URL}connexion/`;
  public static USER_LOGOUT_URL = `${GlobalConstants.API_URL}logoutall/`;

  public static SINGLE_TYPE_USER = `${GlobalConstants.API_URL}type-user/`;
  public static TYPE_USER_UPDATE = `${GlobalConstants.API_URL}type-user-update/`
  public static THEME_TPL = `${GlobalConstants.API_URL}theme/`
  public static IS_SEND_OFFRE = `${GlobalConstants.API_URL}offres/`

  public static color: string = "brown"

  public static DATE_FORMAT = 'yyyy-MM-dd';

  public static DISPLAY_DATE_FORMAT = 'dd/MM/yyyy';

  public static TEL_PATTERN = /^[0-9]{9}$/;
  public static TEL_PATTERN_GN = /^6[2165][0-9]{7}$/;

  public static SELECT_NUMBER_PATTERN = /^[1-9][0-9]*$/;

  public static SELECT_EMAIL_PATTERN = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  public static NUMBER_ONLY_PATTERN = /^[0-9]*$/;

  

  public static current_user() {
    if (localStorage.getItem('user')) {
      return JSON.parse(localStorage.getItem('user'))
    }
  }
  // for refresh navigator
  public static fresh_navigator() {
    let TYPE_RELOAD = 1;
    return performance.navigation.type == TYPE_RELOAD;
  }
  public static format_money(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    // var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ' ' + '$2');
    }
    return x1 ;
}
  public static type_utilisateur() {
    let type_utilisateur = JSON.parse(localStorage.getItem('type_utilisateur'))
    return type_utilisateur
  }
  // public static unread_count(){


  //     returnnotifi = Request.user.notifications.unread().count()
  // }

  public static is_admin() {
    let type_utilisateur = GlobalConstants.type_utilisateur()
    if (type_utilisateur) {
      if (type_utilisateur.name === "Super administrateur") {
        return true
      }
      if (type_utilisateur.name === "Administrateur") {
        return true
      }
    }
    return false
  }
  public static action() {
    let actions = JSON.parse(localStorage.getItem('type_utilisateur'))
    return actions
  }

  public static has_permission(p) {
    let permission = GlobalConstants.type_utilisateur()
    if (permission?.permissions.includes(p)) {
      return true
    } else {
      return false
    }
  }


  public static is_societe() {
    let type_utilisateur = GlobalConstants.type_utilisateur()
    if (type_utilisateur) {
      if (type_utilisateur.name === "societe") {
        return true
      }
    }
    return false
  }

  public static is_consultant() {
    let type_utilisateur = GlobalConstants.type_utilisateur()
    if (type_utilisateur) {
      if (type_utilisateur.name === "consultant") {
        return true
      }
    }
    return false
  }
  public static showNotification(message, type, timer = 1000) {
    $.notify({
      icon: "ti-gift",
      message: message
    }, {
      type: type,
      timer: timer,
      placement: {
        from: 'top',
        align: 'center'
      },
      template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove"></i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
    });
  }




  public static formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [day, month, year].join('/');
  }

  static formatDatelong(date) {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  static getToken() {
    if (localStorage.getItem('token')) {
      return localStorage.getItem('token')
    }
    return
  }

  static errorRequest(error) {
    if (error.status === 401) {
      localStorage.clear();
      window.location.reload();
    }
  }

  static setColor($color) {
    this.color = $color
    var $wizard_step = $('.card-wizard')
    $wizard_step.attr('data-active-color', $color)
  }

  static getColor() {
    return this.color
  }

  static themeButton() {
    var $btn_style = $('.main-content')
    if ($btn_style.length > 0)
      var $theme = localStorage.getItem('theme')
    $btn_style.attr('data-btn-style', $theme)
  }

  static websocket_url() {
    let loc = window.location
    var wsStart = "ws://"
    if (loc.protocol == 'https:') {
      wsStart = 'wss://'
    }
    return `${wsStart}//${GlobalConstants.IP_ADRESS}/ws/notification/`
  }

  static hasPermissionRedirection(permissions,router: Router):void {
    
    if(!Array.isArray(permissions) && !GlobalConstants.has_permission(permissions)){
      router.navigate(['dashboard'])
    } 

    if(Array.isArray(permissions)) {
      if(permissions.every((perm, ind, tab) => !GlobalConstants.has_permission(perm))) {
        router.navigate(['dashboard'])
      }
    }

  }

  public static getProprietaire(proprietaire, is_etat = false,cedant=false) {
    let nom = ''
    let prenom = ''
    let nom_prenom = ''
    let situation_familiale = ''
    let date_naissance = ''
    let adresse = ''
    let profession = ''
    let date_nais = ''
    let lieu_naissance = ''
    let date_naissance_long = ''
    let prenom_pere = ''
    let prenom_nom_mere = ''
    let quartier = ''
    let commune = ''
    let numero_piece = ''
    let expiration_piece = ''
    let object = {
      nom: '', prenom: '', 
      lieu_naissance: '', quartier: '', 
      commune: '', prenom_pere: '', 
      prenom_nom_mere: '', nom_prenom: '', 
      situation_familiale: '', date_naissance: '', 
      date_naissance_long: '', adresse: '', 
      profession: '', date_nais: '', 
      genre: '', nombre: 0,
      numero_piece : '',expiration_piece:""
    }
    let nb_masculin = 0
    let nb_feminin = 0
    if (!is_etat && proprietaire?.length>0) {

      for (let i = 0; i < proprietaire?.length; i++) {
        const element = proprietaire[i];

        if (element.genre == 'Masculin') {
          nb_masculin += 1
        } else {
          nb_feminin += 1
        }
        if (i === 0) {
          nom = element.nom
          prenom = element.prenom
          nom_prenom = prenom + ' ' + nom
          situation_familiale = element.situation_familiale
          adresse = element.commune?.name + '/' + element.quartier
          quartier = element.quartier
          commune = element.commune?.name
          numero_piece = element.numero_identite
          expiration_piece = element.expiration_identite
          profession = element.profession
          date_naissance = this.formatDate(element.date_naissance) + ' à ' + element.lieu_naissance
          date_nais = this.formatDate(element.date_naissance)
          date_naissance_long = this.formatDatelong(element.date_naissance)
          lieu_naissance = element.lieu_naissance
          prenom_pere = element.prenom_pere
          prenom_nom_mere = element.nom_prenom_mere
        } else {
          nom = nom + ', ' + element.nom
          prenom = prenom + ', ' + element.prenom
          nom_prenom = nom_prenom + ',\t' + element.prenom + ' ' + element.nom
          adresse = adresse + ' , \t' + element.commune?.name + '/' + element.quartier
          quartier = quartier + ' , \t' + element?.quartier
          commune = commune + ' , \t' + element?.commune?.name
          numero_piece = numero_piece +" , \t"+ element?.numero_identite
          expiration_piece = expiration_piece +" , \t"+ element?.expiration_identite
          situation_familiale = situation_familiale + ', \t' + element.situation_familiale
          profession = profession + ' ,\t' + element.profession
          date_nais = date_nais + ' ,\t' + this.formatDate(element.date_naissance)
          date_naissance_long = date_naissance_long + ' ,\t' + this.formatDatelong(element.date_naissance)
          lieu_naissance = lieu_naissance + ' ,\t' + element.lieu_naissance
          date_naissance = date_naissance + ', \t' + this.formatDate(element.date_naissance) + ' à ' + element.lieu_naissance
          prenom_pere = prenom_pere + ' ,\t' + element.prenom_pere
          prenom_nom_mere = prenom_nom_mere + ' ,\t' + element.nom_prenom_mere
        }
      }

      if (nb_feminin > 0 && nb_masculin == 0) {
        object.genre = "F"
      } else {
        object.genre = "M"
      }

      object.nom = nom
      object.prenom = prenom
      object.nom_prenom = nom_prenom
      object.adresse = adresse
      object.situation_familiale = situation_familiale
      object.date_naissance = date_naissance
      object.profession = profession
      object.lieu_naissance = lieu_naissance
      object.date_nais = date_nais
      object.date_naissance_long = date_naissance_long
      object.prenom_pere = prenom_pere
      object.quartier = quartier
      object.commune = commune
      object.prenom_nom_mere = prenom_nom_mere
      object.nombre = proprietaire?.length
      object.numero_piece = numero_piece
      object.expiration_piece = expiration_piece
    }else if(cedant && proprietaire?.length==0){
      object.nom = 'Etat Guineen'
      object.prenom = 'Etat Guineen'
      object.nom_prenom = 'Etat Guineen'
      object.adresse = 'Etat Guineen'
      object.quartier = 'Etat Guineen'
      object.commune = 'Etat Guineen'
      object.numero_piece = 'Etat Guineen'
      object.situation_familiale = 'Etat Guineen'
      object.date_naissance = 'Etat Guineen'
      object.profession = 'Etat Guineen'
      object.date_nais = 'Etat Guineen'
      object.lieu_naissance = 'Etat Guineen'
      object.prenom_pere = 'Etat Guineen'
      object.prenom_nom_mere = 'Etat Guineen'
      object.expiration_piece = 'Etat Guineen'
      object.genre = 'M'
      object.nombre = 1
    } else {
      object.nom = 'Etat Guineen'
      object.prenom = 'Etat Guineen'
      object.nom_prenom = 'Etat Guineen'
      object.adresse = 'Etat Guineen'
      object.quartier = 'Etat Guineen'
      object.commune = 'Etat Guineen'
      object.numero_piece = 'Etat Guineen'
      object.situation_familiale = 'Etat Guineen'
      object.date_naissance = 'Etat Guineen'
      object.profession = 'Etat Guineen'
      object.date_nais = 'Etat Guineen'
      object.lieu_naissance = 'Etat Guineen'
      object.prenom_pere = 'Etat Guineen'
      object.prenom_nom_mere = 'Etat Guineen'
      object.expiration_piece = 'Etat Guineen'
      object.genre = 'M'
      object.nombre = 1
    }
    return object
  }

  public static formatNombre(nombre: string) {
		nombre = nombre.replace(/[a-zA-ZÀÁÂÆÇÈÉÊËÌÍÎÏÑÒÓÔŒÙÚÛÜÝŸàáâæçèéêëìíîïñòóôœùúûüýÿ#'";,?%$^=&+}{\[\] ]/g, '')
    
		if(nombre === null || nombre === undefined) {
			return "";
		}
		
		let n = nombre.length;
		let b = Math.floor(n / 3);
		if(n % 3 != 0) {
			b += 1
		}

		nombre = this.reverseChaine(nombre)
		let format = [];
		let start = 0;
		for(let i = 0; i < b; i++) {
			format.push(this.reverseChaine(nombre.substring(start, start + 3)));
			start += 3;
		}

		return format.reverse().join(' ')
	}

	public static reverseChaine(chaine: string) {
		return chaine.split("").reverse().join('')
	}

  public static  compareObjects(object1: any, object2: any) {
    return object1 && object2 && object1.id == object2.id;
  }
}
