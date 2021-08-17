import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import {NgxDocViewerModule} from 'ngx-doc-viewer';


import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { TableListComponent } from './table-list/table-list.component';
import { IconsComponent } from './icons/icons.component';
import { UpgradeComponent } from './upgrade/upgrade.component';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import {KinveyService} from './kinvey.service';
import { Kinvey } from 'kinvey-angular2-sdk';
import * as $ from 'jquery';
import * as bootstrap from 'bootstrap';
import { FrontendComponent } from './frontend/frontend.component';
import { FrontendsidebarComponent } from './frontendsidebar/frontendsidebar.component';
import {FrontendLayoutComponent} from './layouts/frontend-layout/frontend-layout.component';
import { QuillModule } from 'ngx-quill';
import {DocdialogComponent} from './table-list/docdialog/docdialog.component'
import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatDialogModule,
  MatSnackBarModule,
  MatButtonToggleModule
} from '@angular/material';
import { SharedialogComponent } from './table-list/sharedialog/sharedialog.component';

Kinvey.init({
  appKey: 'kid_H1z32vik-',
  appSecret: '5a46b43ae00943e2a5d418bfbd94199c',
  instanceId: 'tju-us1'
});

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    MatTableModule,
    NgxDocViewerModule,
    MatButtonModule,
    MatInputModule,
    MatRippleModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    QuillModule.forRoot()
  ],
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    FrontendLayoutComponent,
    FrontendComponent,
    FrontendsidebarComponent,
    DocdialogComponent,
    SharedialogComponent
    ],
  exports: [FrontendsidebarComponent],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [DocdialogComponent,SharedialogComponent]
})
export class AppModule { }
