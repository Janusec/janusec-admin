import { Routes } from '@angular/router';
import { Frontpage } from './frontpage/frontpage';
import { LoginForm } from './login-form/login-form';
import { Certificates } from './certificates/certificates';
import { Applications } from './applications/applications';
import { CookieRefs } from './cookie-refs/cookie-refs';
import { PortForwardings } from './port-forwardings/port-forwardings';
import { Usermgmt } from './usermgmt/usermgmt';
import { WebFirewall } from './web-firewall/web-firewall';

export const routes: Routes = [
    { path: '', component: Frontpage, title: 'Janusec Application Gateway', },
    { path: 'login', component: LoginForm, title: 'Login' },
    { path: 'certificates', component: Certificates, title: 'Certificates' },
    { path: 'applications', component: Applications, title: 'Applications' },
    { path: 'cookie-refs', component: CookieRefs, title: 'Cookie References' },
    { path: 'port-forwardings', component: PortForwardings, title: 'Port Forwardings' },
    { path: 'user-management', component: Usermgmt, title: 'User Management' },
    { path: 'waf', component: WebFirewall, title: 'Web Application Firewall' },
];
