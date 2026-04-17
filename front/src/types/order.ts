import { Category } from "./category";

export interface OrderProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  stock?: number;
  category?: Category;
}

export interface OrderItem {
  id: number;
  quantity: number;
  product: OrderProduct;
}

export interface Order {
  id: number;
  status: string;
  date: string;

  subtotal: number;
  shippingMethod: string;
  shippingCost: number;
  discount: number;
  total: number;

  items: OrderItem[];
}