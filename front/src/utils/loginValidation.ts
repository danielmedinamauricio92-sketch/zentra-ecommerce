import { LoginFormValues, LoginFormErrors } from "@/types/forms";

export function validateLoginForm(
  values: LoginFormValues
): LoginFormErrors {
  const errors: LoginFormErrors = {};

  const email = values.email.trim();
  const password = values.password.trim();

  if (!email) {
    errors.email = "Ingresá tu email";
  } else if (!email.includes("@")) {
    errors.email = "Email inválido";
  }

  if (!password) {
    errors.password = "Ingresá tu contraseña";
  }

  return errors;
}