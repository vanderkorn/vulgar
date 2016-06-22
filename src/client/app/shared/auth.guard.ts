import { Injectable } from '@angular/core';
import { CanActivate,
         Router,
         ActivatedRouteSnapshot,
         RouterStateSnapshot } from '@angular/router';
import { AuthService } from './services/auth.service';
import { AppState } from '../app.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private appState: AppState, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.appState.get('isAuthenticated')) { return true; }
    /// DEBUG
    /// TODO: Remove this DEBUG statement
    console.log('User authentication failed! Redirecting user to login.');
    this.router.navigate(['/login']);
    return false;
  }
}
