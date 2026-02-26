import type { useTranslation } from 'react-i18next';

type TFunc = ReturnType<typeof useTranslation>['t'];


export function validateEmail(value: string, t: TFunc): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return t('errors.emailRequired');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return t('errors.emailInvalid');
  }

  return '';
}

export function validatePassword(value: string, t: TFunc): string {
  if (!value) {
    return t('errors.passwordRequired');
  }

  if (value.length < 6) {
    return t('errors.passwordMinLength', { min: 6 });
  }

  return '';
}

export function validateUsername(value: string, t: TFunc): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return '';
  }

  if (!trimmed.startsWith('@')) {
    return t('errors.usernameMustStartWithAt');
  }

  if (trimmed.length < 3) {
    return t('errors.usernameMinLength', { min: 3 });
  }

  if (trimmed.includes(' ')) {
    return t('errors.usernameNoSpaces');
  }

  return '';
}