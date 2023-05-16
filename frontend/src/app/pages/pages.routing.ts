import { Routes } from '@angular/router';

import { RegisterComponent } from './register/register.component';
import { LockComponent } from './lock/lock.component';
import { LoginComponent } from './login/login.component';
import { SendmailResetComponent } from './sendmail-reset/sendmail-reset.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';

export const PagesRoutes: Routes = [{
    path: '',
    children: [ {
        path: '',
        component: LoginComponent
    },
    {
        path: 'sendmail',
        component:  SendmailResetComponent
    },
    {
        path: 'update-password/:token',
        component: UpdatePasswordComponent
    }
    /* {
        path: 'lock',
        component: LockComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    } */
]
}];
