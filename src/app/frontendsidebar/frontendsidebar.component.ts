import { Component, OnInit } from '@angular/core';
import { KinveyService } from '../kinvey.service';
import {Kinvey} from 'kinvey-angular2-sdk';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/admin/table-list', title: 'Policies',  icon:'content_paste', class: 'darkslate' },
    { path: '/pathways', title: 'Pathways',  icon:'call_split', class: '' },
    { path: '/admin/icons', title: 'Protocols',  icon:'input', class: '' },
    { path: '/login', title: 'Login',  icon:'account_circle', class: 'darkgreen separatorline' }
  ];

@Component({
  selector: 'app-frontendsidebar',
  templateUrl: './frontendsidebar.component.html',
  styleUrls: ['./frontendsidebar.component.scss']
})

export class FrontendsidebarComponent implements OnInit {
  menuItems: any[];
  isAdmin;

  constructor(private kinvey: KinveyService) {
    this.isAdmin = this.kinvey.isAdmin()
   }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }

  exit() {

  }
  
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}

