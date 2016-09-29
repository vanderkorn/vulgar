import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Detail } from './detail.component';

console.log('`Detail` bundle loaded asynchronously');

// Async components must be named routes for WebpackAsyncRoute
export const routes = [
  { path: '', component: Detail, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    // Components / Directives / Pipes
    Detail
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RoutesModule.forChild(routes)
  ]
});

export default class AboutMoudle {
  static routes = routes;
}
