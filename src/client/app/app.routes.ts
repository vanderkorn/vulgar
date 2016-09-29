import { WebpackAsyncRoute } from '@angularclass/webpack-toolkit';
import { Routes, RouterModule } from '@angular/router';

import { Home } from './home';
import { About } from './about';
import { LoginComponent } from './login/login.component';
import { Recipes } from './recipes/recipes.component';
import { RegisterComponent } from './register/register.component';
import { Todo } from './todo/todo.component';

import { NoContent } from './no-content';

import { DataResolver } from './app.resolver';

import { AuthGuard } from './shared/auth.guard';
import { CanDeactivateGuard } from './shared/interfaces/can-deactivate.interface';

// AngularClass
//import { provideWebpack } from '@angularclass/webpack-toolkit';
//import { providePrefetchIdleCallbacks } from '@angularclass/request-idle-callback';

export const ROUTES: Routes = [
  { path: '',         component: Home },
  { path: 'home',     component: Home },
  // Async Routes
  { path: 'about',    component: About},
  { path: 'login',    component: LoginComponent },
  { path: 'recipes',  component: Recipes, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent, canDeactivate: [CanDeactivateGuard] },
  { path: 'todo',     component: Todo },

  // Catch all other requests and redirect to app `404` view
  { path: '**',       component: NoContent },
];
