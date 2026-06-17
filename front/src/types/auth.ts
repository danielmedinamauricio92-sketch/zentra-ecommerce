import { User } from "@/types/user";

export type RegisterData = {
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type ApiErrorResponse = {
  message?: string;
};

export type RegisterResponse = {
  message?: string;
};

export type LoginResponse = {
  user: User;
};

export type ProfileUpdateData = {
  name: string;
  address: string;
  phone: string;
};
