import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TodoComponent } from './todo.component';

console.log('`Todo` bundle loaded asynchronously');

// async components must be named routes for WebpackAsyncRoute
export const routes = [
  { path: '', component: TodoComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    TodoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
  ]
})

export default class TodoModule {
  static routes = routes;
}
