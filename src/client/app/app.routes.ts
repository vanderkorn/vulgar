import { RouterConfig } from '@angular/router';

import { Home } from './home';
import { LoginComponent } from './login/login.component';
import { Recipes } from './recipes/recipes.component';
import { RegisterComponent } from './register/register.component';
import { Todo } from './todo/todo.component';

export const routes: RouterConfig = [
  { path: '',         component: Home },
  { path: 'home',     component: Home },
  { path: 'login',    component: LoginComponent },
  { path: 'recipes',  component: Recipes },
  { path: 'register', component: RegisterComponent },
  { path: 'todo',     component: Todo },
  // Async load a component using Webpack's require with es6-promise-loader and webpack `require`
  // make sure you match the component type string to the require in asyncRoutes
  { path: 'about', component: 'About' }
];


export const asyncRoutes = {
  'About': require('es6-promise-loader!./about')
};
