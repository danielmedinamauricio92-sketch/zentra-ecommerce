import {
  ApiErrorResponse,
  LoginCredentials,
  LoginResponse,
  RegisterData,
  RegisterResponse,
} from "@/types/auth";

export async function registerUser(
  registerData: RegisterData
): Promise<RegisterResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("No se encontró la URL de la API");
  }

  const response = await fetch(`${apiUrl}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerData),
  });

  const data: RegisterResponse | ApiErrorResponse | null = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    const errorMessage =
      data && "message" in data && typeof data.message === "string"
        ? data.message
        : "Error en el registro";

    throw new Error(errorMessage);
  }

  return data ?? {};
}

export async function loginUser(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("No se encontró la URL de la API");
  }

  const response = await fetch(`${apiUrl}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data: LoginResponse | ApiErrorResponse | null = await response
    .json()
    .catch(() => null);

  if (!response.ok) {
    const errorMessage =
      data && "message" in data && typeof data.message === "string"
        ? data.message
        : "Error en login";

    throw new Error(errorMessage);
  }

  if (!data || !("user" in data) || !("token" in data)) {
    throw new Error("La respuesta del servidor no es válida");
  }

  return data;
}