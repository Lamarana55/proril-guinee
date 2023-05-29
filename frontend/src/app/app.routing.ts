import { Routes } from "@angular/router";
import { RoleGuard } from "./project/auth/services/role-guard.service";

import { PERMISSIONS } from "./config/app.data";
import { AdminLayoutComponent } from "./layouts/admin/admin-layout.component";
import { AuthLayoutComponent } from "./layouts/auth/auth-layout.component";
import { AuthGuard } from "./project/auth/services/auth-guard.service";

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
                },
                /* {
                    path: 'articles',
                    loadChildren: () => import('app/project/article/article.module').then(m => m.ArticleModule),
                    canActivate: [AuthGuard]
                } */
                {
                    path: 'gestion-grossistes',
                    loadChildren: () => import('app/project/gestion-grossiste/gestion-grossiste.module').then(m => m.GestionGrossisteModule),
                    canActivate: [AuthGuard]
                }
                ,{
                    path: 'gestion-produits',
                    loadChildren: () => import('app/project/gestion-produit/gestion-produit.module').then(m => m.GestionProduitModule),
                    canActivate: [AuthGuard]
                }
                ,{
                    path: 'parametrages',
                    loadChildren: () => import('app/project/parametrage/parametrage.module').then(m => m.ParametrageModule),
                    canActivate: [AuthGuard]
                }, {
                    path: 'users',
                    loadChildren: () => import('app/project/user-management/user-management.module').then(m => m.UserManagementModule),
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
