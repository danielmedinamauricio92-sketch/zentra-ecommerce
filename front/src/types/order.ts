import { Category } from "./category";

export interface OrderProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  stock?: number;
  category?: Category;
  quantity?: number;
}

export interface Order {
  id: number;
  status: string;
  date: string;
  products: OrderProduct[];
}