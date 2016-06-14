import { Control } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ValidationService } from '../services/validation.service';
import 'rxjs/Rx';

@Injectable()
export class UsernameValidator {

  constructor(private validationService: ValidationService) {}

  usernameTaken = (control: Control) => {

    let testString = control.value.toLowerCase();

    return this.validationService.validateUsername(testString)
      .catch(()=>Observable.of({"usernameTaken": true}));
  }
}

// This `Validator` implements debouncing with `RxJS`. It is highly
// counterintuitive to create a debouncing async validator with the
// state of things in Angular 2 RC.1
// See: https://github.com/angular/angular/issues/9119
@Injectable()
export class DebouncingUsernameValidator {

  input: any;
  request:  Observable<any>;

  constructor(private validationService: ValidationService) {
    this.input = new ReplaySubject(1);
    this.request = this.input
      .debounceTime(500)
      .distinctUntilChanged()
      .switchMap(input => this.validationService.validateUsername(input))
      .catch((res) => {
        return res.status === 409 ? Observable.of({'usernameTaken': true})
                                  : Observable.of(null);
      })
      .share();
  }

  usernameTaken = (control: Control) => {
    let testString = control.value.toLowerCase();
    this.input.next(testString);
    return this.request;
  }
}
