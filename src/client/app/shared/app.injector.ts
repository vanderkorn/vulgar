import {Injector} from '@angular/core';

let appInjectorRef: Injector;

// Will store the application injector to be used to inject dependencies
// in places like the `CanActivate` decorator, et cetera
// Reference: https://github.com/angular/angular/issues/4112
export const AppInjector = (injector?: Injector):Injector => {
	if (injector) {
	  appInjectorRef = injector;
	}

	return appInjectorRef;
};
