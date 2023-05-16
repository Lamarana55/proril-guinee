import { Routes } from "@angular/router";
import { RoleGuard } from "./mgf/auth/services/role-guard.service";

import { PERMISSIONS } from "./config/app.data";
import { AdminLayoutComponent } from "./layouts/admin/admin-layout.component";
import { AuthLayoutComponent } from "./layouts/auth/auth-layout.component";
import { AuthGuard } from "./mgf/auth/services/auth-guard.service";

export const AppRoutes: Routes = [{
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      }, {
            path: '',
            component: AdminLayoutComponent,
            children: [
                {
                    path: '',
                    loadChildren: () => import('app/dashboard/dashboard.module').then(m => m.DashboardModule),
                    canActivate: [AuthGuard, RoleGuard],
                    data: {
                        permissions: PERMISSIONS.CAN_VIEW_DASHBORD
                    }
                }, {
                    path: 'gestion-cas',
                    loadChildren: () => import('app/mgf/gestion-cas/gestion-cas.module').then(m => m.GestionCasModule),
                    canActivate: [AuthGuard]
                },
                {
                    path: 'articles',
                    loadChildren: () => import('app/mgf/article/article.module').then(m => m.ArticleModule),
                    canActivate: [AuthGuard]
                }, {
                    path: 'parametrages',
                    loadChildren: () => import('app/mgf/parametrage/parametrage.module').then(m => m.ParametrageModule),
                    canActivate: [AuthGuard]
                }, {
                    path: 'users',
                    loadChildren: () => import('app/mgf/user-management/user-management.module').then(m => m.UserManagementModule),
                    canActivate: [AuthGuard]
                }
            ]
        }, {
            path: '',
            component: AuthLayoutComponent,
            children: [
                {
                    path: 'login',
                    loadChildren: './pages/pages.module#PagesModule'
                }
            ]
        }, {
            path: '**',
            redirectTo: 'dashboard',
            pathMatch: 'full'
        }
];
