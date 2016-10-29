/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';

import { AppState } from './app.service';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    '../sass/main.scss'
  ],
  template: `
    <nav>
      <span>
        <a [routerLink]=" ['./'] ">
          Index
        </a>
      </span>
      |
      <span>
        <a [routerLink]=" ['./home'] ">
          Home
        </a>
      </span>
      |
      <span>
        <a [routerLink]=" ['./detail'] ">
          Detail
        </a>
      </span>
      |
      <span>
        <a [routerLink]=" ['./todo'] ">
          Todo
        </a>
      </span>
      |
      <span>
        <a [routerLink]=" ['./about'] ">
          About
        </a>
      </span>
    </nav>

    <main>
      <router-outlet></router-outlet>
    </main>

    <pre class="app-state">this.appState.state = {{ appState.state | json }}</pre>

    <footer>
      <span>Angular 2 MEAN Webpack Starter by <a [href]="url">@datatype_void</a></span>
      <div>
        <a [href]="url">
          <img [src]="angularLogo" width="25%">
        </a>
      </div>
    </footer>
  `
})
export class AppComponent {
  angularLogo = 'assets/img/angular-logo.png';
  name = 'Angular 2 MEAN Webpack Starter';
  url = 'https://twitter.com/datatype_void';

  constructor(public appState: AppState) { }

  ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }

}

/*
 * For help or questions please contact me at @datatype_void on twitter
 * or our chat on Slack at http://www.davidniciforovic.com/wp-login.php?action=slack-invitation
 */
