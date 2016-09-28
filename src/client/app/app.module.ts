import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

/*
 * Platform and Environment providers/directives/pipes
 */
import { PLATFORM_PROVIDERS } from '../platform/browser';
import { ENV_PROVIDERS } from '../platform/environment';
import { ROUTES, ROUTING_PROVIDERS } from './app.routes';

// App is our top level component
import { App } from './app.component';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState } from './app.service';
import { Home } from './home';
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
    PLATFORM_PROVIDERS,
    ENV_PROVIDERS,
    ROUTING_PROVIDERS,
    APP_PROVIDERS,
    APP_STORES
  ]
})
export class AppModule {
}
