import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import router from "./routes";
import morgan from "morgan";
import { FRONTEND_URL, IS_PRODUCTION } from "./config/envs";

const app = express();

app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan(IS_PRODUCTION ? "combined" : "dev"));

app.get("/health", (req: Request, res: Response) => {
  res.status(200).send({ status: "ok" });
});

app.use(router);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode || 500).send({
    statusCode: err.statusCode || 500,
    message: err.message || "Internal Server Error",
  });
});

export default app;
