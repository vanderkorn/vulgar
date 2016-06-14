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
	  authService.authenticate()
      .subscribe((result) => {
				if (result) {
					resolve(true);
				} else {
          console.log('User authentication failed! Redirecting user to login.');
					router.navigate(['Login']);
					resolve(false);
				}
			});
  });
};
