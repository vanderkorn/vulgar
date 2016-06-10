import { Component } from '@angular/core';
import { Router } from '@angular/router-deprecated';
import { Control,
         ControlGroup,
         FormBuilder,
         NgForm,
         NgIf,
         Validators } from '@angular/common';
import { FormModel } from './form.model';
import { AuthService } from '../shared/services/auth.service';
import { EmailValidator } from '../shared/validators/email.validator';

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
// Reference: https://davidwalsh.name/javascript-debounce-function
function debounce(func, wait, immediate = false) {
	let timeout;
	return function() {
		let context = this, args = arguments;
		let later = () => {
			timeout = null;
			if (!immediate) {
        func.apply(context, args);
      }
		};
		let callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) {
      func.apply(context, args);
    }
	};
};

@Component({
  selector: 'login-form',
  providers: [ AuthService, EmailValidator ],
  template: require('./login.component.html'),
  styleUrls: [require('!style!css!sass!./form.scss')]
})

export class LoginComponent {

  // The user registration form is of type `ControlGroup`
  userForm: ControlGroup;

  username: Control;
  password: Control;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router) {
    this.username = new Control('', Validators.compose([
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(16),
    ]))
    this.password = new Control('', Validators.compose([
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(128)
    ]))
    // Use Angular 2's `FormBuilder` `API` to build the
    // user registration form
    this.userForm = this.formBuilder.group({
      username: this.username,
      password: this.password
    });
  }

  model:FormModel = new FormModel('', '');

  submitted:boolean = false;

  active:boolean = true;

  processUserData() {
    let userData = new FormModel(this.model.username.toLowerCase(),
                                 this.model.password);
    this.login(userData);
  }

  login(user) {
    this.submitted = true;
    this.authService.login(user)
      .subscribe((res) => {
        // DEBUG
        // TODO: Remove this DEBUG statement
        console.log(res);
        this.newUser();
        this.router.navigate(['Home']);
      }, (error) => {
        // DEBUG
        // TODO: Remove this DEBUG statement
        console.log(error);
        this.submitted = false;
      });
  }

  getSessionData() {
    this.authService.getSessionData()
      .subscribe((res) => {
        // DEBUG
        // TODO: Remove this DEBUG statement
        console.log(res);
      }, (error) => {
        // DEBUG
        // TODO: Remove this DEBUG statement
        console.log(error);
      });
  }

  newUser() {
    this.model = new FormModel('', '');
    this.active = false;
    setTimeout(() => this.active = true, 0);
  }

  // TODO: Remove this when we are done
  get diagnostic() { return JSON.stringify(this.model); }
}
