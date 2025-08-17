import { Routes } from '@angular/router';
import { Frontpage } from './frontpage/frontpage';
import { LoginForm } from './login-form/login-form';
import { Certificates } from './certificates/certificates';
import { Applications } from './applications/applications';
import { CookieRefs } from './cookie-refs/cookie-refs';
import { PortForwardings } from './port-forwardings/port-forwardings';
import { Usermgmt } from './usermgmt/usermgmt';
import { WebFirewall } from './web-firewall/web-firewall';
import { CCFirewall } from './cc-firewall/cc-firewall';
import { IPFirewall } from './ip-firewall/ip-firewall';
import { WebSSH } from './web-ssh/web-ssh';
import { Nodes } from './nodes/nodes';
import { GSLB } from './gslb/gslb';
import { API } from './api/api';
import { HealthStatus } from './health-status/health-status';
import { WAFLogs } from './waf-logs/waf-logs';
import { CCLogs } from './cc-logs/cc-logs';
import { Settings } from './settings/settings';
import { DiscoveryRules } from './discovery-rules/discovery-rules';
import { Dashboard } from './dashboard/dashboard';
import { AuthcodeRegister } from './authcode-register/authcode-register';

export const routes: Routes = [
    { path: '', component: Frontpage, title: 'Janusec Application Gateway', },
    { path: 'login', component: LoginForm, title: 'Login' },
    { path: 'certificates', component: Certificates, title: 'Certificate Management' },
    { path: 'applications', component: Applications, title: 'Application Management' },
    { path: 'dashboard', component: Dashboard, title: 'Dashboard' },
    { path: 'cookie-refs', component: CookieRefs, title: 'Cookie References' },
    { path: 'port-forwardings', component: PortForwardings, title: 'Port Forwardings' },
    { path: 'user-management', component: Usermgmt, title: 'User Management' },
    { path: 'waf', component: WebFirewall, title: 'Web Application Firewall' },
    { path: 'cc-firewall', component: CCFirewall, title: 'CC Firewall' },
    { path: 'ip-firewall', component: IPFirewall, title: 'IP Firewall' },
    { path: 'webssh', component: WebSSH, title: 'Web-based SSH Client' },
    { path: 'nodes', component: Nodes, title: 'Node Management' },
    { path: 'gslb', component: GSLB, title: 'GSLB' },
    { path: 'api', component: API, title: 'API' },
    { path: 'status', component: HealthStatus, title: 'Health Status' },
    { path: 'waf-logs', component: WAFLogs, title: 'WAF Logs' },
    { path: 'cc-logs', component: CCLogs, title: 'CC Logs' },
    { path: 'settings', component: Settings, title: 'Global Settings' },
    { path: 'discovery-rules', component: DiscoveryRules, title: 'Discovery Rules' },
    { path: 'authcode-register', component: AuthcodeRegister, title: 'Authenticator Registration' },
];
