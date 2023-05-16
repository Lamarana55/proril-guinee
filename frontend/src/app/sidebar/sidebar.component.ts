import { PERMISSIONS } from 'app/config/app.data';
import { AuthService } from 'app/mgf/auth/services/auth.service';
import { Component, OnInit, AfterViewInit, AfterViewChecked, AfterContentInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

// Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    collapse?: string;
    icontype: string;
    // icon: string;
    children?: ChildrenItems[];
    permission?: string
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
    permission?: string
}

// Menu Items
export const ROUTES: RouteInfo[] = [{
        path: '/dashboard',
        title: 'Dashboard',
        type: 'link',
        icontype: 'nc-icon nc-bank',
        permission: PERMISSIONS.CAN_VIEW_DASHBORD
    }, {
        path: '/gestion-cas',
        title: 'Gestion des cas',
        type: 'sub',
        collapse: 'gestion-cas',
        icontype: 'nc-icon nc-layout-11',
        children: [
            {path: 'alertes', title: 'Alertes', ab: 'A', permission: PERMISSIONS.CAN_VIEW_ALERT_MENU},
            {path: 'cas', title: 'Cas', ab: 'C', permission: PERMISSIONS.CAN_VIEW_CAS_MENU},
            {path: 'surveillances', title: 'Surveillance', ab: 'S', permission: PERMISSIONS.CAN_VIEW_SURVEILLANCE_MENU},
            {path: 'statistiques', title: 'Statistiques', ab: 'ST', permission: PERMISSIONS.CAN_VIEW_STATISTIQUE_MENU},
            {path: 'victimes', title: 'Survivant.es', ab: 'S', permission: PERMISSIONS.CAN_VIEW_VICTIME_MENU}
        ]
    },
    {
        path: "/articles",
        title: "Articles",
        type: "sub",
        collapse: "articles",
        icontype: "nc-icon nc-bullet-list-67",
        children: [
          {
            path: "list-article",
            title: "Articles",
            ab: "A",
            permission: PERMISSIONS.CAN_VIEW_ARTICLE_MENU,
          },
          {
            path: "categorie-articles",
            title: "Categorie Article",
            ab: "CA",
            permission: PERMISSIONS.CAN_VIEW_CATEGORIE_ARTICLE_MENU,
          },
        ],
      }, {
        path: '/parametrages',
        title: 'Parametrages',
        type: 'sub',
        collapse: 'parametrages',
        icontype: 'nc-icon nc-settings', 
        children: [
            {path: 'services', title: 'Services', ab: 'S', permission: PERMISSIONS.CAN_VIEW_QUESTION_MENU},
            {path: 'type-cas', title: 'Type de Cas', ab: 'TC', permission: PERMISSIONS.CAN_VIEW_TYPE_CAS_MENU},
            {path: 'partenaires', title: 'Partenaires', ab: 'P', permission: PERMISSIONS.CAN_VIEW_PARTENAIRE_MENU},
            /* {path: 'type-appuis', title: 'Type d\'appui', ab: 'TA', permission: PERMISSIONS.CAN_VIEW_TYPE_APPUI_MENU} */
        ]
    }, {
        path: '/users',
        title: 'Utilisateurs',
        type: 'link',
        icontype: 'nc-icon nc-single-02',
        permission: PERMISSIONS.CAN_VIEW_USER_MENU
    } /* {
        path: '/components',
        title: 'Components',
        type: 'sub',
        collapse: 'components',
        icontype: 'nc-icon nc-layout-11',
        children: [
            {path: 'buttons', title: 'Buttons', ab:'B'},
            {path: 'grid', title: 'Grid System', ab:'GS'},
            {path: 'panels', title: 'Panels', ab:'P'},
            {path: 'sweet-alert', title: 'Sweet Alert', ab:'SA'},
            {path: 'notifications', title: 'Notifications', ab:'N'},
            {path: 'icons', title: 'Icons', ab:'I'},
            {path: 'typography', title: 'Typography', ab:'T'}
        ]
    },{
        path: '/forms',
        title: 'Forms',
        type: 'sub',
        collapse: 'forms',
        icontype: 'nc-icon nc-ruler-pencil',
        children: [
            {path: 'regular', title: 'Regular Forms', ab:'RF'},
            {path: 'extended', title: 'Extended Forms', ab:'EF'},
            {path: 'validation', title: 'Validation Forms', ab:'VF'},
            {path: 'wizard', title: 'Wizard', ab:'W'}
        ]
    },{
        path: '/tables',
        title: 'Tables',
        type: 'sub',
        collapse: 'tables',
        icontype: 'nc-icon nc-single-copy-04',
        children: [
            {path: 'regular', title: 'Regular Tables', ab:'RT'},
            {path: 'extended', title: 'Extended Tables', ab:'ET'},
            {path: 'datatables.net', title: 'Datatables.net', ab:'DT'}
        ]
    },{
        path: '/maps',
        title: 'Maps',
        type: 'sub',
        collapse: 'maps',
        icontype: 'nc-icon nc-pin-3',
        children: [
            {path: 'google', title: 'Google Maps', ab:'GM'},
            {path: 'fullscreen', title: 'Full Screen Map', ab:'FSM'},
            {path: 'vector', title: 'Vector Map', ab:'VM'}
        ]
    },{
        path: '/widgets',
        title: 'Widgets',
        type: 'link',
        icontype: 'nc-icon nc-box'

    },{
        path: '/charts',
        title: 'Charts',
        type: 'link',
        icontype: 'nc-icon nc-chart-bar-32'

    },{
        path: '/calendar',
        title: 'Calendar',
        type: 'link',
        icontype: 'nc-icon nc-calendar-60'
    },{
        path: '/pages',
        title: 'Pages',
        collapse: 'pages',
        type: 'sub',
        icontype: 'nc-icon nc-book-bookmark',
        children: [
            {path: 'timeline', title: 'Timeline Page', ab:'T'},
            {path: 'user', title: 'User Page', ab:'UP'},
            {path: 'login', title: 'Login Page', ab:'LP'},
            {path: 'register', title: 'Register Page', ab:'RP'},
            {path: 'lock', title: 'Lock Screen Page', ab:'LSP'}
        ]
    } */
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit, AfterViewInit {
    public menuItems: any[];
    username = 'USERNAME';
    modalRef: NgbModalRef

    constructor(private auth: AuthService,
                private modalService: NgbModal) {}

    isNotMobileMenu() {
        if ( window.outerWidth > 991) {
            return false;
        }
        return true;
    }

    ngOnInit() {
        this.username = this.auth.getAuth().username;
        // console.log('routes_pro', ROUTES)
        const routes = [...ROUTES];
        this.menuItems = this.loadMenus(routes);
    }

    loadMenus(routes: RouteInfo[]) {
        const permissions = this.auth.getPermissions();
        // console.log('routes', routes)
        const securRoutes: RouteInfo[] = [];
        routes.forEach(menuItem => {
            if (menuItem.type === 'link') {
                const menu = permissions.includes(menuItem.permission) ? menuItem : null;
                if (menu) {
                    securRoutes.push(menu);
                }
            } else {
                const menu = {...menuItem};
                menu.children = menu.children.filter(item => permissions.includes(item.permission))
                if (menu.children.length > 0) {
                    securRoutes.push(menu)
                }
            }
        });
        return securRoutes;
    }

    onLogout() {
        this.auth.logout();
    }

    openModal(content: any) {
        this.modalRef = this.modalService.open(content, {backdrop: 'static', centered: true});
    }

    closeModal(isDone = false) {
        if (isDone) {
            this.modalRef.close();
        }
    }

    ngAfterViewInit() {
        // this.loadMenus();
    }
}
