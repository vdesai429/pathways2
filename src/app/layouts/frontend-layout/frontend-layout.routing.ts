import { Routes } from '@angular/router';

import { PathwaysComponent } from '../../frontend/pathways/pathways.component';
import {LoginComponent} from '../../login/login.component';
import {PoliciesComponent} from 'app/frontend/policies/policies.component';
import {ProtocolsfrontendComponent} from 'app/frontend/protocolsfrontend/protocolsfrontend.component';

export const FrontendLayoutRoutes: Routes = [

    { path: '',   redirectTo: 'protocols' },
    { path: 'pathways',   component: PathwaysComponent },
    { path: 'policies',   component: PoliciesComponent },
    { path: 'protocols', component: ProtocolsfrontendComponent},
    { path: 'login', component: LoginComponent}
];
