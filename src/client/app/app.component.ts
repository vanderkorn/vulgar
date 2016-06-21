// ```
// app.ts
// (c) 2016 David Newman
// blackshuriken@hotmail.com
// app.ts may be freely distributed under the MIT license
// ```

// *src/app/app.ts*

// This file contains the main class as well as the necessary
// decorators for creating the primary `app` `component`

/*
 * Angular 2 decorators and services
 */
import {Component, ViewEncapsulation} from '@angular/core';

import {AppState} from './app.service';

// Import NgFor directive
import {NgFor} from '@angular/common';

import { ChatComponent } from './chat';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  providers: [  ],
  directives: [ NgFor,
                ChatComponent ],
  encapsulation: ViewEncapsulation.None,
  pipes: [],
  // Load our main `Sass` file into our `app` `component`
  styleUrls: [require('!style!css!sass!../sass/main.scss')],
  template: `
    <md-content>
      <md-toolbar color="primary">
          <span>{{ name }}</span>
          <span class="fill"></span>
          <button md-button [routerLink]=" ['./'] ">
            Home
          </button>
          <button md-button [routerLink]=" ['./todo'] ">
            Todo
          </button>
          <button md-button [routerLink]=" ['./recipes'] ">
            Recipes
          </button>
          <button md-button [routerLink]=" ['./register'] ">
            Register
          </button>
          <button md-button [routerLink]=" ['./login'] ">
            Login
          </button>
          <button md-button [routerLink]=" ['./about'] ">
            About
          </button>
      </md-toolbar>

      <md-progress-bar mode="indeterminate" color="primary" *ngIf="loading">
      </md-progress-bar>

      <router-outlet></router-outlet>

      <vu-chat></vu-chat>

      <pre class="app-state">this.appState.state = {{ appState.state | json }}</pre>

      <footer>
        <img [src]="angularLogo" width="7%">
        <span>Angular 2 MEAN Webpack Starter by <a [href]="url">@datatype_void</a></span>
      </footer>
    </md-content>
  `
})
export class App {
  angularLogo = 'assets/img/angular-logo.png';
  name = 'Angular 2 MEAN Webpack Starter';
  url = 'https://twitter.com/datatype_void';

  // Pass in our application `state`
  // Alternative to using `redux`
  constructor(public appState: AppState) {}

  // Fire off upon initialization
  ngOnInit() {

    console.log('Initial App State', this.appState.state);
  }
}

/*
 * For help or questions please contact us at @datatype_void on twitter
 * or our chat on Slack at http://www.davidniciforovic.com/wp-login.php?action=slack-invitation
 */
