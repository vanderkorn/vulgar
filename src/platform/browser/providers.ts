//# Global Providers
//
//** These `providers` are available in any template **

// Angular 2
import {FORM_PROVIDERS,
        LocationStrategy,
        HashLocationStrategy,
        PathLocationStrategy} from '@angular/common';

// Angular 2 Http
import {HTTP_PROVIDERS} from '@angular/http';
// Angular 2 Router
import {ROUTER_PROVIDERS} from '@angular/router-deprecated';

// Angular 2 Material 2
//
// TODO:(datatypevoid): replace with @angular2-material/all
import {MATERIAL_PROVIDERS} from './angular2-material2'

var config = require('../../../config/config.json');

let configLocation: Object = {};

if (config.LOC === 'path')
  configLocation = {provide: LocationStrategy, useClass: PathLocationStrategy};

else
  configLocation = {provide: LocationStrategy, useClass: HashLocationStrategy};

//# Application Providers/Directives/Pipes
//
//** providers/directives/pipes that only live in our browser environment **
export const APPLICATION_PROVIDERS = [
  ...FORM_PROVIDERS,
  ...HTTP_PROVIDERS,
  ...MATERIAL_PROVIDERS,
  ...ROUTER_PROVIDERS,
    configLocation
];

export const PROVIDERS = [
  ...APPLICATION_PROVIDERS
];
