import dotenv from "dotenv";
dotenv.config();

export const PORT: number = Number(process.env.PORT) || 3000;
export const DATABASE_URL: string = process.env.DATABASE_URL || "";
export const DB_NAME: string =
  process.env.DB_NAME || process.env.PGDATABASE || "proyecto_m4_front";
export const DB_USER: string =
  process.env.DB_USER || process.env.PGUSER || "postgres";
export const DB_PASSWORD: string =
  process.env.DB_PASSWORD || process.env.PGPASSWORD || "";
export const DB_HOST: string =
  process.env.DB_HOST || process.env.PGHOST || "localhost";
export const DB_PORT: number =
  Number(process.env.DB_PORT || process.env.PGPORT) || 5432;
export const NODE_ENV: string = process.env.NODE_ENV || "development";
export const IS_PRODUCTION = NODE_ENV === "production";
export const DB_SYNCHRONIZE = process.env.DB_SYNCHRONIZE === "true";
export const FRONTEND_URL: string =
  process.env.FRONTEND_URL || "http://localhost:3000";
export const JWT_SECRET: string = process.env.JWT_SECRET || "";
export const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || "7d";
export const GOOGLE_CLIENT_ID: string = process.env.GOOGLE_CLIENT_ID || "";
export const GOOGLE_CLIENT_SECRET: string =
  process.env.GOOGLE_CLIENT_SECRET || "";
export const GOOGLE_CALLBACK_URL: string =
  process.env.GOOGLE_CALLBACK_URL ||
  `http://localhost:${PORT}/users/google/callback`;
export const ADMIN_EMAILS: string[] = (process.env.ADMIN_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is required");
}
