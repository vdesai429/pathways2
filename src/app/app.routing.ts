import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { FrontendComponent } from './frontend/frontend.component';
import {PathwaysComponent} from 'app/frontend/pathways/pathways.component';
import {AuthGuard} from './auth.guard';

const routes: Routes = [
  {
    path: '',
    component: FrontendComponent,
    children: [{
      path: '',
      loadChildren: './layouts/frontend-layout/frontend-layout.module#FrontendLayoutModule'
    }]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [{
      path: 'admin',
      loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule',
      canActivate: [AuthGuard]
    }]
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
       useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
