import {
  RegisterFormValues,
  RegisterFormErrors,
} from "@/types/forms";

export function validateRegisterForm(
  values: RegisterFormValues
): RegisterFormErrors {
  const errors: RegisterFormErrors = {};

  const name = values.name.trim();
  const email = values.email.trim();
  const password = values.password.trim();
  const confirmPassword = values.confirmPassword.trim();
  const address = values.address.trim();
  const phone = values.phone.trim();

  // Nombre
  if (!name) {
    errors.name = "Ingresá tu nombre";
  } else if (name.length < 2) {
    errors.name = "El nombre debe tener al menos 2 caracteres";
  }

  // Email
  if (!email) {
    errors.email = "Ingresá tu email";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Ingresá un email válido";
  }

  // Contraseña
  if (!password) {
    errors.password = "Ingresá una contraseña";
  } else if (password.length < 8) {
    errors.password = "Debe tener al menos 8 caracteres";
  } else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    errors.password = "Debe incluir letras y números";
  }

  // Confirmar contraseña
  if (!confirmPassword) {
    errors.confirmPassword = "Confirmá tu contraseña";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Las contraseñas no coinciden";
  }

  // Dirección
  if (!address) {
    errors.address = "Ingresá tu dirección";
  } else if (!/[a-zA-Z]/.test(address) || !/[0-9]/.test(address)) {
    errors.address = "Ingresá calle y número";
  }

  // Teléfono
  if (!phone) {
    errors.phone = "Ingresá tu teléfono";
  } else if (!/^\d{8,15}$/.test(phone)) {
    errors.phone =
      "Solo números, entre 8 y 15 dígitos, sin espacios ni símbolos";
  } else if (/^(\d)\1{7,14}$/.test(phone)) {
    errors.phone =
      "No puede estar formado por el mismo número repetido";
  }

  return errors;
}

export function isRegisterFormComplete(
  values: RegisterFormValues
): boolean {
  return (
    values.name.trim() !== "" &&
    values.email.trim() !== "" &&
    values.password.trim() !== "" &&
    values.confirmPassword.trim() !== "" &&
    values.address.trim() !== "" &&
    values.phone.trim() !== ""
  );
}