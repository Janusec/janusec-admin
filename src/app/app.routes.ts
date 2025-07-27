import { Routes } from '@angular/router';
import { Frontpage } from './frontpage/frontpage';
import { LoginForm } from './login-form/login-form';
import { Certificates } from './certificates/certificates';

export const routes: Routes = [
    { path: '', component: Frontpage, title: 'Janusec Application Gateway', },
    { path: 'login', component: LoginForm, title: 'Login' },
    { path: 'certificates', component: Certificates, title: 'Certificates' },
];
