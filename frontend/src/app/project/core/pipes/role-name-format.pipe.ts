import { ROLE_NAME } from 'app/config/app.data';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleNameFormat', pure: true
})
export class RoleNameFormatPipe implements PipeTransform {

  transform(statut: string): string {
    switch (statut) {
      case ROLE_NAME.ROLE_ADMIN:
        return 'Administrateur';
      case ROLE_NAME.ROLE_ASSISTANT_ADMIN:
        return 'Assistant Administrateur';
      case ROLE_NAME.ROLE_CONSULTANT: 
        return 'Consultant';
      case ROLE_NAME.ROLE_GROSSISTE:
        return 'Grossiste';
      default:
        return ''
    }
  }

}
