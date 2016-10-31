import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

import { FormBuilder,
         FormControl,
         FormGroup,
         Validators } from '@angular/forms';

import { AppState } from '../app.service';
import { AuthService } from '../shared/services/auth.service';
import { EqualValidator, UsernameValidator } from '../shared/directives';
import { FormModel } from './form.model';
import { User } from './user.model';

const re = {
  email: {
    complex: {
      // Complex Javascript Regex (ASCII Only)
      // https://regex101.com/r/dZ6zE6/1#
      ascii: '(?=[A-Za-z0-9][A-Za-z0-9@._%+-]{5,253}$)[A-Za-z0-9._%+-]{1,64}@(?:(?=[A-Za-z0-9-]{1,63}\.)[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*\.){1,8}[A-Za-z]{2,63}',
      // Complex Javascript Regex (With Non ASCII Support)
      // https://regex101.com/r/sF6jE4/1
      nonascii: '(?=([A-Za-z0-9]|[^\x00-\x7F])([A-Za-z0-9@._%+-]|[^\x00-\x7F]){5,253}$)([A-Za-z0-9._%+-]|[^\x00-\x7F]){1,64}@(?:(?=([A-Za-z0-9-]|[^\x00-\x7F]){1,63}\.)([A-Za-z0-9]|[^\x00-\x7F])+(?:-([A-Za-z0-9]|[^\x00-\x7F])+)*\.){1,8}([A-Za-z]|[^\x00-\x7F]){2,63}',
    },
    simple: {
      // Simple 'Good Enough' Javascript Regex (ASCII Only)
      // https://regex101.com/r/aI9yY6/1
      ascii: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,63}',
      // Simple 'Good Enough' Javascript Regex (With Non ASCII Support)
      // https://regex101.com/r/hM7lN3/1
      nonascii: '([a-zA-Z0-9._%+-]|[^\x00-\x7F])+?@([a-zA-Z0-9.-]|[^\x00-\x7F])+\.([a-zA-Z]|[^\x00-\x7F]){2,63}'
    }
  }
};

class RegistrationError {

  constructor (
    public state: boolean,
    public message?: string
  ) { }
}

@Component({
  selector: 'register-form',
  templateUrl: './register.component.html',
  styleUrls: [ './form.scss' ]
})
export class RegisterComponent {

  // The user registration form is of type `FormGroup`
  public registerForm: FormGroup;

  // Initialize registration error based on model
  error:RegistrationError = new RegistrationError(false);

  public submitted:boolean = false;
  public accepted:boolean = false;
  public active:boolean = true;

  public events: any[] = [];

  constructor(private appState: AppState,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  newUser() {

    let user = new FormModel('', '', '', '');

    (<FormGroup>this.registerForm).setValue(user, { onlySelf: true });

    this.active = false;

    setTimeout(() => this.active = true, 0);

  }

  ngOnInit() {

    let user = new FormModel('', '', '', '');

    this.registerForm = this.formBuilder.group({
      username: [user.username, [<any>Validators.required, <any>Validators.minLength(3)]],
      email: [user.email, [<any>Validators.required, <any>Validators.minLength(3), <any>Validators.pattern(re.email.complex.ascii.toString())]],
      password: [user.password, [<any>Validators.required, <any>Validators.minLength(8)]],
      confirm: [user.confirm, [<any>Validators.required, <any>Validators.minLength(8)]]
    });
  }

  logout() {

    this.authService.logout().map(res => res.json)
      .subscribe((res) => {
        console.log(res);
      }, (err) => {
        console.error(err);
      });

  }

  processUserData() {
    let userData = new User(this.registerForm.controls['username'].value.toLowerCase(),
                            this.registerForm.controls['password'].value,
                            this.registerForm.controls['email'].value.toLowerCase());
    this.register(userData);
  }

  register(user) {
    // Toggle our `submitted` flag
    this.submitted = true;
    // Reset error state on resubmission
    if(this.error.state)
      this.error.state = false;
    // Attempt to register
    this.authService.register(user)
      .subscribe((res) => {
        // DEBUG
        // TODO: Remove this DEBUG statement
        console.log(res);
        // If registration is successful...
        // Reset our form...
        this.newUser();
        // Toggle our `accepted` flag...
        this.accepted = true;
        // Proceed to the `Login` component
        this.router.navigate(['/login']);
      }, (error) => {
        // DEBUG
        // TODO: Remove this DEBUG statement
        console.error(error);
        // If registration fails...
        // Toggle our error state...
        this.error.state = true;
        // Set our error message based on the server rejection reason
        this.error.message = error._body;
        // Toggle our `submitted` flag to false so the user
        // can modify their information
        this.submitted = false;
      });
  }

  // Function invoked by the `CanDeactivate` router lifecycle hook when
  // a user tries to leave this component view. If the form has been
  // interacted with, query the user as to whether they intended to
  // navigate away from the registration form before submission.
  /*canDeactivate(): Observable<boolean> | boolean {
    // Ask the user with a confirmation dialog service
    if(!this.userForm.pristine && !this.accepted) {
      return confirm('You haven\'t submitted your registration. Are you sure '
                     + 'you want to navigate away from this page?'); }

    // Otherwise allow the user to navigate away from this component freely
    else {
      return true;
    }
  }*/


  // TODO: Remove this when we are done
  get diagnostic() { return JSON.stringify(this.registerForm.value); }
}
