import { AbstractControl, ValidatorFn } from '@angular/forms';

export function passwordConfirmationValidator(password: string): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const confirmed = control.value !== password;
    return confirmed ? {checkConfirmation: {value: control.value}} : null
  }
}
