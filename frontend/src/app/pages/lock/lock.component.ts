import { Component, ElementRef, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "app/mgf/auth/services/auth.service";
import { UtilService } from "app/mgf/core/services/util.service";

declare var $: any;

@Component({
  moduleId: module.id,
  selector: "lock-cmp",
  templateUrl: "./lock.component.html",
})
export class LockComponent implements OnInit {
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
    body.classList.add("lock-page");

    var navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName("navbar-toggle")[0];

    setTimeout(function () {
      // after 1000 ms we add the class animated to the login/register card
      $(".card").removeClass("card-hidden");
    }, 700);

    this.initForm()
  }

  initForm() {
    this.resetForm = this.fb.group({
      email: ["", Validators.required],
    });
  }

  cleanForm() {
    this.initForm();
    this.resetForm.markAsUntouched();
    this.resetForm.markAsPristine();
    this.resetForm.updateValueAndValidity();
  }

  onSubmit() {
    /* if (this.resetForm.invalid) {
      const controls = this.resetForm.controls;
      Object.keys(controls).forEach((key) => controls[key].markAsTouched());
      return;
    } */
     
    this.auth.sendEmail(this.resetForm.value).subscribe(
      () => {
        this.utils.showNotif('Operation effectuée avec succès', 'success');
        this.cleanForm() 
        this.router.navigate(['/login'])
      },
      err => {
        this.utils.showNotif(`Une erreur est survenue lors de l'opération \n ${err}`, 'danger')
      }
    )

  }

  ngOnDestroy() {
    var body = document.getElementsByTagName("body")[0];
    body.classList.remove("lock-page");
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
}
