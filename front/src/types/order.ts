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
  customerName?: string;
  customerEmail?: string;
  shippingAddress?: string;
  recipientName?: string;
  discount: number;
  total: number;

  items: OrderItem[];
}
