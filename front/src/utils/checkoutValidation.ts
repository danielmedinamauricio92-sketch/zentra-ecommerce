export type CheckoutFormValues = {
  name: string;
  email: string;
  address: string;
};

export type CheckoutFormErrors = {
  name?: string;
  email?: string;
  address?: string;
};

export function validateCheckoutForm(
  values: CheckoutFormValues
): CheckoutFormErrors {
  const errors: CheckoutFormErrors = {};

  const name = values.name.trim();
  const email = values.email.trim();
  const address = values.address.trim();

  if (!name) {
    errors.name = "Ingresá tu nombre";
  } else if (name.length < 2) {
    errors.name = "Nombre muy corto";
  }

  if (!email) {
    errors.email = "Ingresá tu email";
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = "Email inválido";
  }

  if (!address) {
    errors.address = "Ingresá tu dirección";
  } else if (!/[a-zA-Z]/.test(address) || !/[0-9]/.test(address)) {
    errors.address = "Debe contener calle y número";
  }

  return errors;
}