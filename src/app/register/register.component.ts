import { Component } from '@angular/core';
import { Router,
         RouteConfig,
         RouteParams,
         RouteData,
         ComponentInstruction,
         CanDeactivate } from '@angular/router-deprecated';
import { Control,
         ControlGroup,
         FormBuilder,
         NgForm,
         NgIf,
         Validators } from '@angular/common';
import { User } from './user.model';
import { FormModel } from './form.model';
import { AuthService } from '../shared/services/auth.service';
import { EmailValidator } from '../shared/validators/email.validator';
import { UsernameValidator, DebouncingUsernameValidator } from '../shared/validators/username.validator';
import { matchingPasswords } from '../shared/validators/password.validator';

class RegistrationError {

  constructor (
    public state: boolean,
    public message?: string
  ) {}
}

@Component({
  selector: 'register-form',
  providers: [AuthService, EmailValidator],
  template: require('./register.component.html'),
  styleUrls: [require('!style!css!sass!./form.scss')]
})
export class RegisterComponent implements CanDeactivate {

  // The user registration form is of type `ControlGroup`
  userForm: ControlGroup;

  // Define form controls
  username: Control;
  password: Control;
  confirm: Control;
  email: Control;

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router,
              private usernameValidator: DebouncingUsernameValidator) {
    // Setup each of our controls using the `Control` `API`
    this.username = new Control('', Validators.compose([
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(16),
    ]), usernameValidator.usernameTaken)
    this.password = new Control('', Validators.compose([
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(128)
    ]))
    this.confirm = new Control('', Validators.compose([
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(128)
    ]))
    this.email = new Control('', Validators.compose([
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(254),
      EmailValidator.isValidFormat
    ]))
    // Use Angular 2's `FormBuilder` `API` to build the
    // user registration form
    this.userForm = this.formBuilder.group({
      username: this.username,
      password: this.password,
      confirm: this.confirm,
      email: this.email
    }, { validator: matchingPasswords('password', 'confirm')});
  }

  // Initialize our form data based on our model
  model:FormModel = new FormModel('', '', '', '');
  // Initialize registration error based on model
  error:RegistrationError = new RegistrationError(false);

  submitted:boolean = false;
  accepted:boolean = false;
  active:boolean = true;

  newUser() {
    this.model = new FormModel('', '', '', '');
    this.active = false;
    setTimeout(() => this.active = true, 0);
  }

  ngOnInit() { }

  processUserData() {
    let userData = new User(this.model.username.toLowerCase(),
                            this.model.password,
                            this.model.email);
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
        router.navigate(['Login']);
      }, (error) => {
        // DEBUG
        // TODO: Remove this DEBUG statement
        console.log(error);
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

  // Function invoked by the `CanDeactive` router lifecycle hook when
  // a user tries to leave this component view. If the form has been
  // interacted with, query the user as to whether they intended to
  // navigate away from the registration form before submission.
  routerCanDeactivate(next: ComponentInstruction, prev: ComponentInstruction) {
    if(!this.userForm.pristine) {
      return confirm('You haven\'t submitted your registration. Are you sure '
                     + 'you want to navigate away from this page?'); }
  }

  // TODO: Remove this when we are done
  get diagnostic() { return JSON.stringify(this.model); }
}
