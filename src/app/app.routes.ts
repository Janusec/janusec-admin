import { Routes } from '@angular/router';
import { Frontpage } from './frontpage/frontpage';
import { LoginForm } from './login-form/login-form';

export const routes: Routes = [
    { path: '', component: Frontpage, title: 'Janusec Application Gateway', },
    { path: 'janusec-admin', component: Frontpage, title: 'Janusec Application Gateway', },
    { path: 'login', component: LoginForm, title: 'Login' },
];
