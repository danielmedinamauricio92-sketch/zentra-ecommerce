export interface CreateOrderProductDto {
  productId: number;
  quantity: number;
}

export interface CreateOrderDto {
  userId: number;
  products: CreateOrderProductDto[];
  subtotal: number;
  shippingMethod: string;
  shippingCost: number;
  discount: number;
  total: number;
}