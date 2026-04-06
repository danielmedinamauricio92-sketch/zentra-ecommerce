import { Category } from "./category";

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image: string;
  description?: string;
  isOffer?: boolean;
  category: Category;
}