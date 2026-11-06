import { describe, expect, it } from "vitest";
import { ClientError } from "../errors";

describe("ClientError", () => {
  it("es una instancia de Error con el mensaje dado", () => {
    const error = new ClientError("No encontrado", 404);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ClientError);
    expect(error.message).toBe("No encontrado");
    expect(error.statusCode).toBe(404);
  });

  it("usa 400 como statusCode por defecto", () => {
    const error = new ClientError("Solicitud inválida");
    expect(error.statusCode).toBe(400);
    expect(error.message).toBe("Solicitud inválida");
  });

  it("acepta otros códigos, como 401 o 422", () => {
    expect(new ClientError("No autorizado", 401).statusCode).toBe(401);
    expect(new ClientError("Datos inválidos", 422).statusCode).toBe(422);
  });
});
