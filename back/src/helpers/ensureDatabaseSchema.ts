import { AppDataSource } from "../config/dataSource";

export const ensureDatabaseSchema = async () => {
  await AppDataSource.query(`
    ALTER TABLE "products"
    ADD COLUMN IF NOT EXISTS "isActive" boolean NOT NULL DEFAULT true
  `);
};
