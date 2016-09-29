import {Injectable} from '@angular/core';
import {HmrState} from 'angular2-hmr';

@Injectable()
export class AppState {

  _state = { };

  constructor() {
    // Configure default application state if needed
    this.configureDefaults();
  }

  private configureDefaults() {
    // TODO: Default this value based on the result of calling `authService.authenticate()`
    this.set('isAuthenticated', false);
  }

  // Already return a `clone` of the current `state`
  get state() {
    return this._state = this._clone(this._state);
  }

  // Never allow mutation
  set state(value) {
    throw new Error('Do not mutate the `.state` directly!');
  }

  get(prop?: any) {
    // Use our `state` getter for the `clone`
    const state = this.state;
    return state.hasOwnProperty(prop) ? state[prop] : state;
  }

  set(prop: string, value: any) {
    // Internally mutate our `state`
    return this._state[prop] = value;
  }

  _clone(object) {
    // Simple object `clone`
    return JSON.parse(JSON.stringify( object ));
  }
}
