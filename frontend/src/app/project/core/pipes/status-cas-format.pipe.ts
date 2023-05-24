import { Pipe, PipeTransform } from '@angular/core';
import { STATUT_CAS } from 'app/config/app.data';

@Pipe({
  name: 'statusCasFormat', pure: true
})
export class StatusCasFormatPipe implements PipeTransform {

  transform(statut: string, forColor = false): string {
    switch (statut) {
      case STATUT_CAS.EN_ATTENTE:
        return forColor ? 'accent' : 'En attente';
      case STATUT_CAS.EN_COURS:
        return forColor ? 'info-default' : 'En cours';
      case STATUT_CAS.TRAITE:
        return forColor ? 'success' : 'Traité';
      case STATUT_CAS.ANNULE:
        return forColor ? 'cancel' : 'Annulé';
      default:
        return ''
    }
  }

}
