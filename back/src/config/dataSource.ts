import { DataSource } from "typeorm";
import {
  DATABASE_URL,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_SYNCHRONIZE,
  DB_USER,
  IS_PRODUCTION,
} from "./envs";
import { User } from "../entities/User";
import { Credential } from "../entities/Credential";
import { Order } from "../entities/Order";
import { Category } from "../entities/Category";
import { Product } from "../entities/Product";
import { OrderDetail } from "../entities/OrderDetail";
import { CartItem } from "../entities/CartItem";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: DATABASE_URL || undefined,
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: DB_SYNCHRONIZE || !IS_PRODUCTION,
  // dropSchema: true,
  logging: false,
  entities: [User, Credential, Order, Product, Category, OrderDetail, CartItem],
  subscribers: [],
  migrations: [],
});
