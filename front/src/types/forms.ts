export type LoginFormValues = {
  email: string;
  password: string;
};

export type LoginFormErrors = {
  email?: string;
  password?: string;
  general?: string;
};

export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
  phone: string;
};

export type RegisterFormErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  address?: string;
  phone?: string;
  general?: string;
};