import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationsComponent } from '../applications/applications.component';
import { CertificatesComponent } from '../certificates/certificates.component';
import { ApplicationDetailComponent } from '../application-detail/application-detail.component';
import { LoginFormComponent } from '../login-form/login-form.component';
import { CertificateDetailComponent } from '../certificate-detail/certificate-detail.component';
import { UsermgmtComponent } from '../usermgmt/usermgmt.component';
import { UserDetailComponent } from '../user-detail/user-detail.component';
import { WAFComponent } from '../waf/waf.component';
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
import { WebsshComponent } from '../webssh/webssh.component';
import { HealthCheckComponent } from '../health-check/health-check.component';
import { VipAppsComponent } from '../vip-apps/vip-apps.component';
import { VipAppComponent } from '../vip-app/vip-app.component';
import { RefererComponent } from '../referer/referer.component';
import { AuthcodeRegisterComponent } from '../authcode-register/authcode-register.component';
import { CcComponent } from '../cc/cc.component';
import { IpPolicyComponent } from '../ip-policy/ip-policy.component';
import { DiscoveryRulesComponent } from '../discovery-rules/discovery-rules.component';
import { ApiInterfaceComponent } from '../api-interface/api-interface.component';
import { CookieRefsComponent } from '../cookie-refs/cookie-refs.component';

const routes: Routes = [
    { path: '', redirectTo: '/index.html', pathMatch: 'full' },
    { path: 'index.html', component: FrontpageComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'application/:id', component: ApplicationDetailComponent },
    { path: 'applications', component: ApplicationsComponent },
    { path: 'forwarding', component: VipAppsComponent },
    { path: 'vip/:id', component: VipAppComponent },
    { path: 'certificates', component: CertificatesComponent },
    { path: 'certificate/:id', component: CertificateDetailComponent },
    { path: 'usermgmt', component: UsermgmtComponent },
    { path: 'appuser/:id', component: UserDetailComponent },
    { path: 'waf', component: WAFComponent },
    { path: 'cc', component: CcComponent },
    { path: 'ip-policy', component: IpPolicyComponent },
    { path: 'policy/:id', component: PolicyComponent },
    { path: 'nodes', component: NodesComponent },
    { path: 'node/:id', component: NodeDetailComponent },
    { path: 'logs', component: LogsComponent },
    { path: 'cclogs', component: CCLogsComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'log/:id', component: LogDetailComponent },
    { path: 'cclog/:id', component: CCLogDetailComponent },
    { path: 'login', component: LoginFormComponent },
    { path: 'webssh', component: WebsshComponent },
    { path: 'health', component: HealthCheckComponent },
    { path: 'referring/:app_id/:host', component: RefererComponent },
    { path: 'authcode-register', component: AuthcodeRegisterComponent },
    { path: 'discovery-rules', component: DiscoveryRulesComponent },
    { path: 'api-interface', component: ApiInterfaceComponent },
    { path: 'cookie-refs', component: CookieRefsComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
