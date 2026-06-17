import {
  LoginCredentials,
  LoginResponse,
  ProfileUpdateData,
  RegisterData,
  RegisterResponse,
} from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function registerUser(
  userData: RegisterData
): Promise<RegisterResponse> {
  const res = await fetch(`${API_URL}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error al registrar el usuario");
  }

  return data;
}

export async function loginUser(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error al iniciar sesión");
  }

  return data;
}

export async function getCurrentUser(): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/users/me`, {
    credentials: "include",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "No hay una sesión activa");
  }

  return data;
}

export async function updateUserProfile(
  profile: ProfileUpdateData
): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profile),
    credentials: "include",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "No se pudieron actualizar los datos");
  }

  return data;
}

export async function logoutUser(): Promise<void> {
  await fetch(`${API_URL}/users/logout`, {
    method: "POST",
    credentials: "include",
  });
}

export function getGoogleLoginUrl() {
  return `${API_URL}/users/google`;
}
