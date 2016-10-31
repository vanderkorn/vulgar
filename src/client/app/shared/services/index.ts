export * from './admin-guard.service';
export * from './auth-guard.service';
export * from './auth.service';
export * from './validation.service';

import { AdminGuard } from './admin-guard.service';
import { AuthGuard } from './auth-guard.service';
import { AuthService } from './auth.service';
import { ValidationService } from './validation.service';

export const SHARED_APP_SERVICES = [
  AdminGuard,
  AuthGuard,
  AuthService,
  ValidationService
];
