import { HttpErrorResponse } from "@angular/common/http";
import { Component, ElementRef, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { ResetPassword } from "app/project/auth/models/reset-passwor.model";
import { AuthService } from "app/project/auth/services/auth.service";
import { passwordConfirmationValidator } from "app/project/core/directives/confirmation-validators.directive";
import { UtilService } from "app/project/core/services/util.service";
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: "app-update-password",
  templateUrl: "./update-password.component.html",
  styleUrls: ["./update-password.component.css"],
})
export class UpdatePasswordComponent implements OnInit {
  focus;
  focus1;
  focus2;

  test: Date = new Date();
  private toggleButton;
  private sidebarVisible: boolean;
  private nativeElement: Node;

  updatePasswordForm: FormGroup;
  serverError = false;
  serverMessage = "";
  isLoading = false;
  token = "";
  fieldTextType: boolean = false;
  fieldTextTypeConfirm: boolean = false;

  constructor(
    private element: ElementRef,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private utils: UtilService,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar
  ) {
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
  }
  checkFullPageBackgroundImage() {
    var $page = $(".full-page");
    var image_src = $page.data("image");

    if (image_src !== undefined) {
      var image_container =
        '<div class="full-page-background" style="background-image: url(' +
        image_src +
        ') "/>';
      $page.append(image_container);
    }
  }

  ngOnInit() {
    this.token = this.route.snapshot.params["token"];
    this.checkFullPageBackgroundImage();

    var body = document.getElementsByTagName("body")[0];
    body.classList.add("sendmail-page");

    var navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName("navbar-toggle")[0];

    setTimeout(function () {
      // after 1000 ms we add the class animated to the login/register card
      $(".card").removeClass("card-hidden");
    }, 700);

    this.initForm();
  }

  initForm() {
    this.updatePasswordForm = this.fb.group({
      newPassword: ["", [Validators.required, Validators.minLength(4)]],
      confirmation: [null, Validators.required],
    });
  }

  cleanForm() {
    this.initForm();
    this.updatePasswordForm.markAsUntouched();
    this.updatePasswordForm.markAsPristine();
    this.updatePasswordForm.updateValueAndValidity();
  }

  onSubmit() {
    const controls = this.updatePasswordForm.controls;

    if (this.updatePasswordForm.invalid) {
      Object.keys(controls).forEach((key) => controls[key].markAsTouched());
      return;
    }
    const request = {
      token: this.token,
      password: this.updatePasswordForm.value.newPassword,
    } as ResetPassword;

    this.isLoading = true;
    this.auth.updatePassword(request).subscribe(
      (data) => {
        // this.utils.showNotif("Operation effectuée avec succès", "success");
        var statut = data.status;
        this.cleanForm();
        Swal.fire({
          title: "Modification du mot de passe",
          icon: statut ? "success" : "error",
          text: statut
            ? "Votre mot de passe a été modifié avec succès.\n, merci de vous connecter "
            : "Une erreur s'est produite",
          showConfirmButton: true,
          preConfirm: () => {
            this.isLoading = false;
            this.router.navigate(["/login"]);
          },
        });
      },

      // (err: {status: number, error: {message: string}}) => {
      (error) => {
        error.subscribe((data) => { console.log(data);},
        (er: HttpErrorResponse) => {
          const err = {
            status: er.status,
            error: { message: er.message },
          };
          Object.keys(controls).forEach((key) => controls[key].setErrors({ incorrect: true }));
          this.serverError = true;
          if (err.status === 403) {
            this.serverMessage =
              "Veillez reprendre la procedure, car le lien a expirer ";
          } else if (err.status === 404) {
            this.serverMessage =
              "Impossible de modifier le mot de passe le lien n'est pas valide,  veillez contacter l'administrateur morykeith88@gmail.com";
          }
          this.isLoading = false;
          
        })
      }
    );
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("sendmail");
  }

  sidebarToggle() {
    var toggleButton = this.toggleButton;
    var body = document.getElementsByTagName("body")[0];
    var sidebar = document.getElementsByClassName("navbar-collapse")[0];
    if (this.sidebarVisible == false) {
      setTimeout(function () {
        toggleButton.classList.add("toggled");
      }, 500);
      body.classList.add("nav-open");
      this.sidebarVisible = true;
    } else {
      this.toggleButton.classList.remove("toggled");
      this.sidebarVisible = false;
      body.classList.remove("nav-open");
    }
  }

  hasError(propertyName: string): boolean {
    const control = this.updatePasswordForm.controls[propertyName];
    return control.invalid && (control.dirty || control.touched);
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  toggleFieldTextTypeConfirm() {
    this.fieldTextTypeConfirm = !this.fieldTextTypeConfirm;
  }

  ngAfterViewInit() {
    $("#newPasswordTxt").on("keyup", () => {
      const control = this.updatePasswordForm.controls["newPassword"];
      if (control.valid) {
        this.updatePasswordForm
          .get("confirmation")
          .setValidators([
            Validators.required,
            passwordConfirmationValidator(control.value),
          ]);
          
        this.updatePasswordForm.get("confirmation").updateValueAndValidity();
        
      }
    });
  } 
}
