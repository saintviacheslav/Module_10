import { useState } from "react";

type Errors<T> = Partial<Record<keyof T, string>>;

export function useForm<T extends Record<string, unknown>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Errors<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  function setFieldValue<K extends keyof T>(field: K, value: T[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function setFieldError<K extends keyof T>(field: K, error: string) {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }

  function touchField<K extends keyof T>(field: K) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  return {
    values,
    errors,
    touched,
    setFieldValue,
    setFieldError,
    touchField,
    setErrors,
  };
}
