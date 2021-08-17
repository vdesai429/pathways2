import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FrontendLayoutRoutes } from './frontend-layout.routing';
import {NgxDocViewerModule} from 'ngx-doc-viewer';
import {PathwaysComponent} from '../../frontend/pathways/pathways.component';
import {LoginComponent} from 'app/login/login.component';
import { PoliciesComponent } from '../../frontend/policies/policies.component';
import {QuillModule} from 'ngx-quill';

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
  MatButtonToggleModule
} from '@angular/material';
import {ProtocolsfrontendComponent} from 'app/frontend/protocolsfrontend/protocolsfrontend.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(FrontendLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NgxDocViewerModule,
    MatDialogModule,
    MatButtonToggleModule,
    QuillModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    PathwaysComponent,
    LoginComponent,
    PoliciesComponent,
    ProtocolsfrontendComponent
  ],
  entryComponents: [
  ]
})

export class FrontendLayoutModule {}
