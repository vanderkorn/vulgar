import { Injector } from '@angular/core';
import { AppInjector } from './app.injector';
import { AuthService } from './services/auth.service';
import { Router, ComponentInstruction } from '@angular/router-deprecated';

export const authUser = (next: ComponentInstruction, prev: ComponentInstruction) => {
	let injector: Injector = AppInjector(); // Get the stored reference to the injector
	let authService: AuthService = injector.get(AuthService);
	let router: Router = injector.get(Router);

  // Return a boolean or a promise that resolves a boolean
	return new Promise((resolve) => {
	  authService.loggedIn()
      .subscribe((result) => {
				if (result) {
					resolve(true);
				} else {
          /// DEBUG
          /// TODO: Remove this DEBUG statement
          console.log('auth failed');
					router.navigate(['Login']);
					resolve(false);
				}
			});
  });
};
