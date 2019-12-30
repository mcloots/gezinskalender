import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/auth/auth.service';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  loggedin: boolean;
}
export const ROUTES: RouteInfo[] = [
  { path: '/login', title: 'Inloggen', icon: 'account_circle', class: '', loggedin: false },
  { path: '/register', title: 'Registreren', icon: 'work', class: '', loggedin: false },
  { path: '/activiteit-dashboard', title: 'Dashboard', icon: 'dashboard', class: '', loggedin: true },
  { path: '/gezin-dashboard', title: 'Mijn gezin', icon: 'people', class: '', loggedin: true },
  { path: '/user-profile', title: 'Mijn profiel', icon: 'person', class: '', loggedin: true },
  /*{ path: '/table-list', title: 'Table List',  icon:'content_paste', class: '' },
  { path: '/typography', title: 'Typography',  icon:'library_books', class: '' },
  { path: '/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
  { path: '/maps', title: 'Maps',  icon:'location_on', class: '' },
  { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },*/
  { path: '/logout', title: 'Afmelden', icon: 'cancel', class: 'active-pro', loggedin: true },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  };

  isShown(item: RouteInfo): boolean {
    if (item.loggedin && this.authService.isLoggedIn()) {
      return true;
    } else if (!item.loggedin && !this.authService.isLoggedIn()) {
      return true;
    }

    return false;
  }
}
