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
import { FormModel } from './form.model';
import { User } from './user.model';

@Component({
  templateUrl: './login.component.html',
  styleUrls: [ './form.scss' ]
})
export class LoginComponent {

  // The user login form is of type `FormGroup`
  public loginForm: FormGroup;

  public submitted:boolean = false;
  public accepted:boolean = false;
  public active:boolean = true;

  public events: any[] = [];

  public message: string;

  constructor(private appState: AppState,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router) { }

  setMessage() {
    this.message = 'Logged ' + (this.appState.get('isAuthenticated') ? 'in' : 'out');
  }

  newUser() {

    let user = new FormModel('', '');

    (<FormGroup>this.loginForm).setValue(user, { onlySelf: true });

    this.active = false;

    setTimeout(() => this.active = true, 0);

  }

  ngOnInit() {

    setTimeout(() => this.setMessage(), 0);

    let user = new FormModel('', '');

    this.loginForm = this.formBuilder.group({
      username: [user.username, [<any>Validators.required, <any>Validators.minLength(3)]],
      password: [user.password, [<any>Validators.required, <any>Validators.minLength(8)]],
    });
  }

  processUserData() {
    let userData = new User(this.loginForm.controls['username'].value.toLowerCase(),
                            this.loginForm.controls['password'].value);
    this.login(userData);
  }

  login(user) {

    this.submitted = true;

    this.message = 'Trying to log in ...';

    this.authService.login(user).subscribe((res) => {

      if (this.appState.get('isAuthenticated')) {

        this.setMessage();

        this.newUser();

        // Get the redirect URL from our auth service
        // If no redirect has been set, use the default
        let redirect = this.authService.redirectUrl
          ? this.authService.redirectUrl
          : '/home';

        // Redirect the user
        this.router.navigate([redirect]);

      }

    }, (error) => {
      // DEBUG
      // TODO: Remove this debug statement
      console.error(error);
      this.submitted = false;
    });

  }

  logout() {

    this.authService.logout().map(res => res.json)
      .subscribe((res) => {
        console.log(res);
      }, (err) => {
        console.error(err);
      });

    this.setMessage();
  }

}
