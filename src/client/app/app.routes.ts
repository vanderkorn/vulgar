import { RouterConfig } from '@angular/router';

import { Home } from './home';
import { LoginComponent } from './login/login.component';
import { NoContent } from './no-content';
import { Recipes } from './recipes/recipes.component';
import { RegisterComponent } from './register/register.component';
import { Todo } from './todo/todo.component';

import { AuthGuard } from './shared/auth.guard';
import { CanDeactivateGuard } from './shared/interfaces/can-deactivate.interface';

export const routes: RouterConfig = [
  { path: '',         component: Home },
  { path: 'home',     component: Home },
  { path: 'login',    component: LoginComponent },
  { path: 'recipes',  component: Recipes, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'todo',     component: Todo },
  // Async load a component using Webpack's require with es6-promise-loader and webpack `require`
  // make sure you match the component type string to the require in asyncRoutes
  { path: 'about',    component: 'About' },

  // Catch all other requests and redirect to app `404` view
  { path: '**',       component: NoContent },
];

// `asyncRoutes` is needed for our `webpack-toolkit` to allow us to resolve
// the component correctly
export const asyncRoutes = {
  'About': require('es6-promise-loader!./about')
};
