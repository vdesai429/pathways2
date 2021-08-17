import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { QuillComponent } from 'app/quill/quill.component';
import {ProtocolsComponent} from 'app/protocols/protocols.component';

export const AdminLayoutRoutes: Routes = [

    { path: '',      redirectTo: 'dashboard' },
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'table-list',     component: TableListComponent },
    { path: 'protocols', component: ProtocolsComponent},
    { path: 'upgrade',        component: UpgradeComponent },
    { path: 'editor',        component: QuillComponent }
];
