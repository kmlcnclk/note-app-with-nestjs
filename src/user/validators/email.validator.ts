import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'email', async: false })
export class EmailValidator implements ValidatorConstraintInterface {
  private readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  validate(value: string, _args: ValidationArguments) {
    console.log(value);

    if (!value) {
      return true;
    }
    return this.emailRegex.test(value);
  }

  defaultMessage(_args: ValidationArguments) {
    return 'Invalid email address';
  }
}
