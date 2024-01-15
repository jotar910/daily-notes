import { FieldError, RegisterOptions } from 'react-hook-form';

export function validationMessage(error: FieldError, validations?: RegisterOptions): string {
    switch (error.type) {
        case 'required':
            return 'This field is required.'
        case 'minLength':
            return validations ? `Minimum length is ${validations.minLength}.` : 'This field has an invalid minimum length.';
        case 'maxLength':
            return validations ? `Maximum length is ${validations.maxLength}.` : 'This field has an invalid maximum length.';
        default:
            return 'This field is invalid.';
    }
}
