//# Providers provided by Angular
import {bootstrap} from '@angular/platform-browser-dynamic';

//# Required Angular providers to enable PathLocationStrategy
import {provide} from '@angular/core';
import {APP_BASE_HREF} from '@angular/common';
import {ROUTER_PROVIDERS} from '@angular/router';

//## Platform and Environment
//
//** our providers/directives/pipes **
import {DIRECTIVES, PIPES, PROVIDERS} from './platform/browser';
import {ENV_PROVIDERS} from './platform/environment';

//## App Component
//
//** our top level component that holds all of our components **
import {App, APP_PROVIDERS, APP_STORES} from './app';

// Bootstrap our Angular app with a top level component `App` and inject
// our Services and Providers into Angular's dependency injection
// NOTE: ROUTER_PROVIDERS and provide lines for PathLocationStrategy

export function main(initialHmrState?: any): Promise<any> {

  return bootstrap(App, [

    ...PROVIDERS,
    ...ENV_PROVIDERS,
    ...DIRECTIVES,
    ...PIPES,
    ...APP_PROVIDERS,
    ...APP_STORES,
    ROUTER_PROVIDERS,
    provide(APP_BASE_HREF, {useValue: '/'})
  ])
  .catch(err => console.error(err));
}

//## Vendors
//
// For vendors for example jQuery, Lodash, angular2-jwt just import them anywhere in your app
// You can also import them in vendors to ensure that they are bundled in one file
// Also see custom-typings.d.ts as you also need to do `typings install x` where `x` is your module

//## Hot Module Reload
//
// experimental version

if ('development' === ENV && HMR === true) {

  // activate hot module reload
  let ngHmr = require('angular2-hmr');
  ngHmr.hotModuleReplacement(main, module);
} else {

  // bootstrap when documetn is ready
  document.addEventListener('DOMContentLoaded', () => main());
}
