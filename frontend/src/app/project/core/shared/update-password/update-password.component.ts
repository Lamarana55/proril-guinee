import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, AfterViewInit, EventEmitter, Output } from '@angular/core';
import Swal from 'sweetalert2';
import { passwordConfirmationValidator } from '../../directives/confirmation-validators.directive';
import { UpdatePassword } from '../../models/update-password.model';
import { UserService } from 'app/mgf/user-management/services/user.service';
import { AuthService } from 'app/mgf/auth/services/auth.service';

declare var $: any;

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit, AfterViewInit {

  updateForm: FormGroup;
  @Output() isDone = new EventEmitter<boolean>();

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private auth: AuthService,
              private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.updateForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(4)]],
      confirmation: [null, Validators.required]
    })
  }

  resetForm() {
    this.initForm();
    this.updateForm.markAsPristine();
    this.updateForm.markAsUntouched();
    this.updateForm.updateValueAndValidity();
  }

  onSubmit() {
    if (!this.updateForm.invalid) {
      const request = {newPassword: this.updateForm.value.newPassword,
                          oldPassword: this.updateForm.value.oldPassword} as UpdatePassword;

      this.userService.updatePassword(request).subscribe(
        () => {
          this.resetForm();
          this.isDone.emit(true);
          Swal.fire({
            icon: 'success',
            title: 'Modification du mot de passe',
            text: 'Votre mot de passe a été modifié avec succès.\nVous allez être déconnecté.',
            showConfirmButton: true
          }).then(() => this.auth.logout())
        },
        err => {
          this.snackbar.open('Une erreur est survenue lors de la modification ' + err, '',
                                {duration: 3000, verticalPosition: 'top', panelClass: ['my-snack-warning']})
          this.updateForm.controls['oldPassword'].setErrors({'incorrect': true})
        }
      )
    }
  }

  ngAfterViewInit() {
    $('#newPasswordTxt').on('keyup', () => {
      const control = this.updateForm.controls['newPassword'];
      if (control.valid) {
        this.updateForm.get('confirmation').setValidators([Validators.required, passwordConfirmationValidator(control.value)]);
        this.updateForm.get('confirmation').updateValueAndValidity();
      }
    })
  }

}
