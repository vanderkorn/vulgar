// Angular 2
import {enableProdMode} from '@angular/core';

// Environment Providers
let PROVIDERS = [
  // Common environment providers
];

if ('production' === ENV) {
  // Production
  enableProdMode();

  PROVIDERS = [
    ...PROVIDERS
    // Custom providers in `production`
  ];

} else {
  // Development
  PROVIDERS = [
    ...PROVIDERS
    // Custom providers in `development`
  ];

}

export const ENV_PROVIDERS = [
  ...PROVIDERS
];
