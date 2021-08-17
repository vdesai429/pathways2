import { Component, OnInit, NgZone } from '@angular/core';
import { KinveyService } from '../../kinvey.service';

declare const $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  isAdmin;

  userRoutes = [
    { path: '/protocols', title: 'Protocols',  icon:'input', class: 'steelblue' },    
    { path: '/policies', title: 'Policies',  icon:'content_paste', class: 'darkslate' },
    { path: '/pathways', title: 'Pathways',  icon:'call_split', class: 'darkcyan' },
    { path: '/login', title: 'Login',  icon:'account_circle', class: 'darkgreen separatorline' }
];

 adminRoutes = [
    { path: '/admin/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/admin/protocols', title: 'Protocols',  icon:'input', class: 'steelblue' },
    { path: '/admin/table-list', title: 'Policies',  icon:'content_paste', class: 'darkslate' },
    { path: '/admin/editor', title: 'Pathways',  icon:'call_split', class: 'darkcyan' },
    { path: '/admin/user-profile', title: 'Users',  icon:'person', class: 'darkgreen' },
    { path: '/login', title: 'Logout',  icon:'account_circle', class: 'darkgreen separatorline' }
];

  constructor(private kinvey: KinveyService, private zone: NgZone) {
    this.isAdmin = this.kinvey.isAdmin();
    this.kinvey.adminStatus.subscribe((status) => {
        this.isAdmin = status; 
        
        if (status) {
            this.menuItems = this.adminRoutes;
            console.log("loadadmin")
          }
    
          else {
                this.menuItems = this.userRoutes;
                console.log("loaduser")
          }
        })
   }

  ngOnInit() {
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

  logout() {
      this.kinvey.logout()
  }
}
