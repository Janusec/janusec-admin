import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch(),),
    provideAnimationsAsync(),
    provideAnimations(),
    provideNoopAnimations(),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    /* 
    Do not use APP_BASE_HREF because it will occur /#/janusec-admin/
    { provide: APP_BASE_HREF, useValue: '/janusec-admin' }
    We need /janusec-admin/#/, so use the following instead: 
    "baseHref": "/janusec-admin/" in angular.json
    */
  ]
};
