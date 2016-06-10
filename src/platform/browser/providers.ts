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
import { MATERIAL_PROVIDERS } from './angular2-material2'

// Import any custom validators
import { UsernameValidator,
         DebouncingUsernameValidator } from '../../app/shared/validators/username.validator';
import { ValidationService } from '../../app/shared/services/validation.service';
import { AuthService } from '../../app/shared/services/auth.service';

//# Application Providers/Directives/Pipes
//
//** providers/directives/pipes that only live in our browser environment **
export const APPLICATION_PROVIDERS = [
  ...FORM_PROVIDERS,
  ...HTTP_PROVIDERS,
  ...MATERIAL_PROVIDERS,
  ...ROUTER_PROVIDERS,
  {provide: LocationStrategy, useClass: PathLocationStrategy },
//{provide: LocationStrategy, useClass: HashLocationStrategy },
  AuthService,
  ValidationService,
  UsernameValidator,
  DebouncingUsernameValidator
];

export const PROVIDERS = [
  ...APPLICATION_PROVIDERS
];
