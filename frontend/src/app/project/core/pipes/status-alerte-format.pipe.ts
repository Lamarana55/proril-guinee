import { STATUT_ALERTE } from 'app/config/app.data';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusAlerteFormat', pure: true
})
export class StatusAlerteFormatPipe implements PipeTransform {

  transform(statut: string, forColor = false): string {
    switch (statut) {
      case STATUT_ALERTE.NON_TRAITE:
        return forColor ? 'accent' : 'Non traité';
      case STATUT_ALERTE.TRAITE:
        return forColor ? 'info' : 'Traité';
      default:
        return ''
    }
  }

}
