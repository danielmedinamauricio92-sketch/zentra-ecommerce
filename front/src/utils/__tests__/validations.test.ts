import { describe, expect, it } from "vitest";
import { validateLoginForm } from "../loginValidation";
import {
  isRegisterFormComplete,
  validateRegisterForm,
} from "../registerValidation";
import { validateCheckoutForm } from "../checkoutValidation";

const validRegister = {
  name: "Dani Medina",
  email: "dani@example.com",
  password: "Pass1234",
  confirmPassword: "Pass1234",
  address: "Calle Falsa 123",
  phone: "12345678",
};

describe("validateLoginForm", () => {
  it("no devuelve errores con email y contraseña válidos", () => {
    expect(
      validateLoginForm({ email: "dani@example.com", password: "secreta" })
    ).toEqual({});
  });

  it("pide email y contraseña cuando están vacíos", () => {
    const errors = validateLoginForm({ email: "", password: "" });
    expect(errors.email).toBe("Ingresá tu email");
    expect(errors.password).toBe("Ingresá tu contraseña");
  });

  it("rechaza un email sin @", () => {
    expect(
      validateLoginForm({ email: "dani.example.com", password: "secreta" })
    ).toEqual({ email: "Email inválido" });
  });

  it("ignora espacios alrededor del email y la contraseña", () => {
    expect(
      validateLoginForm({
        email: "  dani@example.com  ",
        password: "  secreta  ",
      })
    ).toEqual({});
  });

  it("rechaza una contraseña de solo espacios", () => {
    expect(
      validateLoginForm({ email: "dani@example.com", password: "   " })
    ).toEqual({ password: "Ingresá tu contraseña" });
  });
});

describe("validateRegisterForm", () => {
  it("no devuelve errores con datos válidos (teléfono de 8 dígitos)", () => {
    expect(validateRegisterForm(validRegister)).toEqual({});
  });

  it("pide el nombre y lo exige con al menos 2 caracteres", () => {
    expect(validateRegisterForm({ ...validRegister, name: "" }).name).toBe(
      "Ingresá tu nombre"
    );
    expect(validateRegisterForm({ ...validRegister, name: "D" }).name).toBe(
      "El nombre debe tener al menos 2 caracteres"
    );
  });

  it("rechaza un email inválido", () => {
    expect(
      validateRegisterForm({ ...validRegister, email: "no-es-email" }).email
    ).toBe("Ingresá un email válido");
  });

  it("exige contraseña de al menos 8 caracteres con letras y números", () => {
    expect(
      validateRegisterForm({ ...validRegister, password: "Ab1" }).password
    ).toBe("Debe tener al menos 8 caracteres");
    expect(
      validateRegisterForm({
        ...validRegister,
        password: "Password",
        confirmPassword: "Password",
      }).password
    ).toBe("Debe incluir letras y números");
    expect(
      validateRegisterForm({
        ...validRegister,
        password: "12345678",
        confirmPassword: "12345678",
      }).password
    ).toBe("Debe incluir letras y números");
  });

  it("exige confirmar la contraseña y que coincida", () => {
    expect(
      validateRegisterForm({ ...validRegister, confirmPassword: "" })
        .confirmPassword
    ).toBe("Confirmá tu contraseña");
    expect(
      validateRegisterForm({ ...validRegister, confirmPassword: "Otra1234" })
        .confirmPassword
    ).toBe("Las contraseñas no coinciden");
  });

  it("exige calle y número en la dirección", () => {
    expect(
      validateRegisterForm({ ...validRegister, address: "Calle Falsa" })
        .address
    ).toBe("Ingresá calle y número");
    expect(
      validateRegisterForm({ ...validRegister, address: "123" }).address
    ).toBe("Ingresá calle y número");
  });

  it("exige un teléfono de exactamente 8 dígitos (comportamiento actual)", () => {
    // PENDIENTE: el código actual solo verifica la longitud (phone.length !== 8),
    // no que sean solo dígitos ni un formato argentino real (ver informe).
    expect(validateRegisterForm({ ...validRegister, phone: "" }).phone).toBe(
      "Ingresá tu teléfono"
    );
    expect(
      validateRegisterForm({ ...validRegister, phone: "1234567" }).phone
    ).toBeDefined();
    expect(
      validateRegisterForm({ ...validRegister, phone: "123456789" }).phone
    ).toBeDefined();
    expect(
      validateRegisterForm({ ...validRegister, phone: "12345678" }).phone
    ).toBeUndefined();
  });

  it("rechaza un teléfono de 8 veces el mismo dígito", () => {
    expect(
      validateRegisterForm({ ...validRegister, phone: "11111111" }).phone
    ).toBe("No puede estar formado por el mismo número repetido");
  });
});

describe("isRegisterFormComplete", () => {
  it("es true con todos los campos no vacíos", () => {
    expect(isRegisterFormComplete(validRegister)).toBe(true);
  });

  it("es false si falta un campo, aunque los demás sean válidos", () => {
    expect(isRegisterFormComplete({ ...validRegister, phone: "" })).toBe(
      false
    );
    expect(isRegisterFormComplete({ ...validRegister, name: "   " })).toBe(
      false
    );
  });
});

describe("validateCheckoutForm", () => {
  const valid = {
    name: "Dani Medina",
    email: "dani@example.com",
    address: "Calle Falsa 123",
  };

  it("no devuelve errores con datos válidos", () => {
    expect(validateCheckoutForm(valid)).toEqual({});
    expect(
      validateCheckoutForm({ ...valid, recipientName: "Ana" })
    ).toEqual({});
  });

  it("pide nombre, email y dirección cuando están vacíos", () => {
    const errors = validateCheckoutForm({
      name: "",
      email: "",
      address: "",
    });
    expect(errors.name).toBe("Ingresá tu nombre");
    expect(errors.email).toBe("Ingresá tu email");
    expect(errors.address).toBe("Ingresá tu dirección");
  });

  it("rechaza nombre de 1 carácter y email inválido", () => {
    expect(validateCheckoutForm({ ...valid, name: "D" }).name).toBe(
      "Nombre muy corto"
    );
    expect(validateCheckoutForm({ ...valid, email: "dani@" }).email).toBe(
      "Email inválido"
    );
  });

  it("exige calle y número en la dirección", () => {
    expect(validateCheckoutForm({ ...valid, address: "Calle" }).address).toBe(
      "Debe contener calle y número"
    );
    expect(validateCheckoutForm({ ...valid, address: "123" }).address).toBe(
      "Debe contener calle y número"
    );
  });

  it("el destinatario es opcional, pero si está debe tener al menos 2 letras", () => {
    expect(
      validateCheckoutForm({ ...valid, recipientName: "" }).recipientName
    ).toBeUndefined();
    expect(
      validateCheckoutForm({ ...valid, recipientName: "A" }).recipientName
    ).toBe("Debe tener al menos 2 letras");
  });
});
