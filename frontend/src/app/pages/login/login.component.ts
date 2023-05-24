import { Component, OnInit, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'app/mgf/auth/services/auth.service';

declare const $: any;

@Component({
    moduleId: module.id,
    selector: 'login-cmp',
    templateUrl: './login.component.html',
    styleUrls: ["./login.component.css"],

})

export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  focus;
  focus1;
  focus2;
    test: Date = new Date();
    private toggleButton;
    private sidebarVisible: boolean;
    private nativeElement: Node;

    loginForm: FormGroup;
    serverError = false;
    serverMessage = '';
    isLoading = false;
    fieldTextType: boolean = false;

    constructor(private element: ElementRef,
                private fb: FormBuilder,
                private auth: AuthService,
                private router: Router) {
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
    }

    

    checkFullPageBackgroundImage() {
        const $page = $('.full-page');
        const image_src = $page.data('image');

        if (image_src !== undefined) {
            const image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>'
            $page.append(image_container);
        }
    };

    ngOnInit() {
        this.checkFullPageBackgroundImage();
        const body = document.getElementsByTagName('body')[0];
        body.classList.add('login-page');
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];

        setTimeout(function(){
            // after 1000 ms we add the class animated to the login/register card
            $('.card').removeClass('card-hidden');
        }, 700)

        this.initForm();
    }
    ngOnDestroy() {
        const body = document.getElementsByTagName('body')[0];
        body.classList.remove('login-page');
    }

    sidebarToggle() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        const sidebar = document.getElementsByClassName('navbar-collapse')[0];
        if (this.sidebarVisible == false) {
            setTimeout(function() {
                toggleButton.classList.add('toggled');
            }, 500);
            body.classList.add('nav-open');
            this.sidebarVisible = true;
        } else {
            this.toggleButton.classList.remove('toggled');
            this.sidebarVisible = false;
            body.classList.remove('nav-open');
        }
    }


    // ================================= LOGIN ================================== //

    initForm() {
        this.loginForm = this.fb.group({
          telephone: ['', [Validators.required, Validators.minLength(4)]],
          password: ['', [Validators.required, Validators.minLength(4)]]
        })
    }

    onSubmit() {
        const controls = this.loginForm.controls;

        if (this.loginForm.invalid) {
            Object.keys(controls).forEach(key => controls[key].markAsTouched());
            return;
        }

        const request = this.loginForm.value as {telephone: string, password: string};
        this.isLoading = true;
        this.auth.login(request).subscribe(
            data => {
            this.auth.setAuth(data);
            this.router.navigate(['/dashboard']);
            },

            (err: {status: number, error: {message: string}}) => {
            Object.keys(controls).forEach(key => controls[key].setErrors({'incorrect': true}));
            this.serverError = true;
            this.serverMessage = err.status !== 403 ? 'Nom d\'utilisateur ou mot de passe incorrecte' : err.error.message;
            this.isLoading = false;
            }
        )
    }

    hasError(propertyName: string): boolean {
        const control = this.loginForm.controls[propertyName];
        return control.invalid && (control.dirty || control.touched);
    }

    toggleFieldTextType(){
        this.fieldTextType = !this.fieldTextType;
      }

    ngAfterViewInit() {
        $('#usernameTxt, #passwordTxt').keyup(e => {
            if (e.key === 'Enter') {
                this.onSubmit();
            }
        }).click(e => {
             
            e.target.select();
        })
    }

}
