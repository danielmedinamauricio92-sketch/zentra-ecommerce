import { describe, expect, it } from "vitest";
import type { User } from "@/types/user";
import { isProfileComplete } from "../profile.utils";

const user = (overrides: Partial<User> = {}): User => ({
  id: 1,
  name: "Dani Medina",
  email: "dani@example.com",
  address: "Calle Falsa 123",
  phone: "12345678",
  role: "user",
  ...overrides,
});

describe("isProfileComplete", () => {
  it("es false sin usuario", () => {
    expect(isProfileComplete(null)).toBe(false);
  });

  it("es true con nombre, dirección y teléfono completos", () => {
    expect(isProfileComplete(user())).toBe(true);
  });

  it("es false si falta nombre, dirección o teléfono", () => {
    expect(isProfileComplete(user({ name: "" }))).toBe(false);
    expect(isProfileComplete(user({ address: "" }))).toBe(false);
    expect(isProfileComplete(user({ phone: "" }))).toBe(false);
  });

  it("trata 'pendiente' como incompleto, sin importar mayúsculas o espacios", () => {
    expect(isProfileComplete(user({ name: "pendiente" }))).toBe(false);
    expect(isProfileComplete(user({ address: "  Pendiente  " }))).toBe(
      false
    );
    expect(
      isProfileComplete(user({ phone: "pendiente de completar" }))
    ).toBe(false);
    expect(
      isProfileComplete(user({ name: "Pendiente De Completar" }))
    ).toBe(false);
  });
});
