import { describe, expect, it, vi } from "vitest";
import { catchedController } from "../catchedController";

describe("catchedController", () => {
  it("llama al controlador con req y res y no llama a next si no hay error", async () => {
    const controller = vi.fn(async () => undefined);
    const req = { params: { id: "1" } };
    const res = {};
    const next = vi.fn();

    await catchedController(controller)(req, res, next);

    expect(controller).toHaveBeenCalledTimes(1);
    expect(controller).toHaveBeenCalledWith(req, res);
    expect(next).not.toHaveBeenCalled();
  });

  it("pasa el error a next cuando el controlador rechaza (async)", async () => {
    const error = new Error("falló la base de datos");
    const controller = vi.fn(async () => {
      throw error;
    });
    const next = vi.fn();

    await catchedController(controller)({}, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });

  it("pasa el error a next cuando el controlador lanza de forma síncrona", async () => {
    const error = new Error("error síncrono");
    const controller = vi.fn(() => {
      throw error;
    });
    const next = vi.fn();

    await catchedController(controller)({}, {}, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });
});
