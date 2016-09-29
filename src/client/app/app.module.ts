import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from '../platform/environment';
import { ROUTES } from './app.routes';

// App is our top level component
import { App } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState } from './app.service';
import { Home } from './home';
import { About } from './about';
import { NoContent } from './no-content';

//# Global Redux Stores
//
//** These `redux` `stores` are available in any template **

// Import module to provide an app `store` for the life-cycle of the app
import {provideStore} from '@ngrx/store';

// Import all of the files necessary for our `recipes` component
import {RecipeService} from './recipes/recipe.service';
import {recipes} from './recipes/recipes.reducer';
import {selectedRecipe} from './recipes/selected-recipe.reducer';

// Application wide providers
const APP_PROVIDERS = [
  ...APP_RESOLVER_PROVIDERS,
  AppState
];

//# Application Redux Stores
//
//** Redux stores for use with our Angular 2 app **
const APP_STORES = [
  // These are the primary consumers of our app store
  RecipeService,
  // Inititialize app store available to entire app
  // and pass in our reducers.
  // Notice that we are passing in an object that matches the
  // `AppStore` interface
  provideStore({ recipes, selectedRecipe })
];

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ App ],
  declarations: [
    App,
    About,
    Home,
    NoContent
  ],
  imports: [ // import Angular's modules
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, { useHash: true })
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS,
    APP_STORES
  ]
})
export class AppModule {
  constructor(public appRef: ApplicationRef, public appState: AppState) {}
    hmrOnInit(store) {
      if (!store || !store.state) return;
      console.log('HMR store', store);
      this.appState._state = store.state;
      delete store.state;
    }
    hmrOnDestroy(store) {
      var cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
      // Recreate elements
      var state = this.appState._state;
      store.state = state;
      store.disposeOldHosts = createNewHosts(cmpLocation)
      // Remove styles
      removeNgStyles();
    }
    hmrAfterDestroy(store) {
      // Display new elements
      store.disposeOldHosts()
      delete store.disposeOldHosts;
  }
}
