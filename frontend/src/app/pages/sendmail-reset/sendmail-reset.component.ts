import { Component, ElementRef, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "app/project/auth/services/auth.service";
import { UtilService } from "app/project/core/services/util.service";
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: "app-sendmail-reset",
  templateUrl: "./sendmail-reset.component.html",
  styleUrls: ["./sendmail-reset.component.css"],
})
export class SendmailResetComponent implements OnInit {
  focus;
  focus1;
  focus2;

  test: Date = new Date();
  private toggleButton;
  private sidebarVisible: boolean;
  private nativeElement: Node;

  resetForm: FormGroup;
  serverError = false;
  serverMessage = "";
  isLoading = false;

  constructor(
    private element: ElementRef,
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private utils: UtilService
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
    this.resetForm = this.fb.group({ 
      email: ['', [Validators.required, Validators.email]],
    });
  }

  cleanForm() {
    this.initForm();
    this.resetForm.markAsUntouched();
    this.resetForm.markAsPristine();
    this.resetForm.updateValueAndValidity();
  }

  onSubmit() {
    const controls = this.resetForm.controls;

    if (this.resetForm.invalid) {
      Object.keys(controls).forEach((key) => controls[key].markAsTouched());
      return;
    }
    this.isLoading = true;
    this.auth.sendEmail(this.resetForm.value.email).subscribe(
      (response) => {
        // this.utils.showNotif("Operation effectuée avec succès", "success");
        var statut = response.status;
        this.cleanForm();
       Swal.fire({ 
          title: "Mail Envoyé",
          icon: statut ? 'success' : 'error',
          text: statut ? "L'email a été envoyé avec succès, merci de verifier votre boite mail" : "Une erreur s'est produite",
          showConfirmButton: true,
          preConfirm: ()=> {
            this.router.navigate(["/login"]);
          }
        })
      },
      
      (err: {status: number, error: {message: string}}) => {
        Object.keys(controls).forEach(key => controls[key].setErrors({'incorrect': true}));
        this.serverError = true;
        this.serverMessage = err.status !== 404 ? 'l\'email n\'existe pas dans la base de données,  veillez contacter l\'administrateur du site ' : err.error.message;
        this.isLoading = false;
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
    const control = this.resetForm.controls[propertyName];
    return control.invalid && (control.dirty || control.touched);
  }

ngAfterViewInit() {
    $('#email').keyup(e => {
        if (e.key === 'Enter') {
            this.onSubmit();
        }
    }).click(e => {
        // console.log(e)
        e.target.select();
    })
}

}
