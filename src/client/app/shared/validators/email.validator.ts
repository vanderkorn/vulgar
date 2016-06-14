import { Control } from '@angular/common';

interface ValidationResult {
  [key:string]:boolean;
}

export class EmailValidator {
  // Simplified, a `validator` is just a `function` that takes a `Control` and
  // returns `null` if valid or an `error` `object` if it is invalid.
  static isValidFormat(control: Control): ValidationResult {
    let regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return regex.test(control.value) ? null : { 'isValidFormat': true }
  }
}
