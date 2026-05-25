import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const PERSONAL_DOMAINS = [
  'gmail.com',
  'gmail.com.ar',
  'hotmail.com',
  'hotmail.es',
  'hotmail.co',
  'outlook.com',
  'outlook.es',
  'yahoo.com',
  'yahoo.es',
  'yahoo.com.ar',
  'icloud.com',
  'me.com',
  'live.com',
  'live.es',
  'live.com.ar',
  'msn.com',
  'aol.com',
  'protonmail.com',
  'pm.me',
];

@ValidatorConstraint({ name: 'isBusinessEmail', async: false })
export class IsBusinessEmailConstraint implements ValidatorConstraintInterface {
  validate(email: string) {
    if (!email || !email.includes('@')) return false;
    const domain = email.split('@')[1]?.toLowerCase();
    return !!domain && !PERSONAL_DOMAINS.includes(domain);
  }

  defaultMessage(_args: import('class-validator').ValidationArguments) {
    return 'El email debe ser corporativo. No aceptamos cuentas de Gmail, Hotmail, Outlook, Yahoo u otros proveedores personales.';
  }
}

export function IsBusinessEmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsBusinessEmailConstraint,
    });
  };
}
