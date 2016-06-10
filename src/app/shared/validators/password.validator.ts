import { ControlGroup } from '@angular/common';

export function matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
  return (group: ControlGroup) => {
    let passwordInput = group.controls[passwordKey];
    let passwordConfirmationInput = group.controls[passwordConfirmationKey];
    return (passwordInput.value !== passwordConfirmationInput.value)
      ? passwordConfirmationInput.setErrors({notEquivalent: true}) 
      : passwordConfirmationInput.setErrors({notEquivalent: false})
  }
}
