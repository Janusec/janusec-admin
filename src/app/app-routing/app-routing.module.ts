import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationsComponent }      from '../applications/applications.component';
import { CertificatesComponent } from '../certificates/certificates.component';
import { ApplicationDetailComponent }  from '../application-detail/application-detail.component';
import { LoginFormComponent } from '../login-form/login-form.component';
import { CertificateDetailComponent } from '../certificate-detail/certificate-detail.component';
import { UsermgmtComponent } from '../usermgmt/usermgmt.component';
import { UserDetailComponent } from '../user-detail/user-detail.component';
import { FirewallComponent } from '../firewall/firewall.component';
import { PolicyComponent } from '../policy/policy.component';
import { NodesComponent } from '../nodes/nodes.component';
import { NodeDetailComponent } from '../node-detail/node-detail.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { LogsComponent } from '../logs/logs.component';
import { LogDetailComponent } from '../log-detail/log-detail.component';
import { CCLogsComponent } from '../cclogs/cclogs.component';
import { CCLogDetailComponent } from '../cclog-detail/cclog-detail.component';
import { SettingsComponent } from '../settings/settings.component';
import { FrontpageComponent } from '../frontpage/frontpage.component';

const routes: Routes = [
  { path: '', redirectTo: '/index', pathMatch: 'full' },
  { path: 'index', component: FrontpageComponent},
  { path: 'dashboard', component: DashboardComponent},
  { path: 'application/:id', component: ApplicationDetailComponent },
  { path: 'applications', component: ApplicationsComponent },
  { path: 'certificates', component: CertificatesComponent },
  { path: 'certificate/:id', component: CertificateDetailComponent },
  { path: 'usermgmt', component: UsermgmtComponent},
  { path: 'appuser/:id', component: UserDetailComponent},
  { path: 'waf', component: FirewallComponent},
  { path: 'policy/:id', component: PolicyComponent},
  { path: 'nodes', component: NodesComponent},
  { path: 'node/:id', component: NodeDetailComponent},
  { path: 'logs', component: LogsComponent},
  { path: 'cclogs', component: CCLogsComponent},
  { path: 'settings', component: SettingsComponent},
  { path: 'log/:id', component: LogDetailComponent},
  { path: 'cclog/:id', component: CCLogDetailComponent},
  { path: 'login', component: LoginFormComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
