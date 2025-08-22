import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const latinLettersOnly = (): ValidatorFn => {
  const re = /^[A-Za-z]+$/;
  return (control: AbstractControl): ValidationErrors | null => {
    const v = control.value as string;
    if (v == null || v === '') return null;
    return re.test(v) ? null : { latinOnly: true };
  };
};

export const matchFields = (
  field: string,
  confirmField: string
): ValidatorFn => {
  return (group: AbstractControl): ValidationErrors | null => {
    const main = group.get(field);
    const confirm = group.get(confirmField);
    if (!main || !confirm) return null;

    const same = main.value === confirm.value;
    if (!same) {
      confirm.setErrors({ ...(confirm.errors ?? {}), mismatch: true });
    } else {
      if (confirm.hasError('mismatch')) {
        const { mismatch, ...rest } = confirm.errors ?? {};
        confirm.setErrors(Object.keys(rest).length ? rest : null);
      }
    }
    return null;
  };
};
