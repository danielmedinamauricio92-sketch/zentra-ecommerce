export interface CreateOrderProductDto {
  productId: number;
  quantity: number;
}

export interface CreateOrderDto {
  userId: number;
  products: CreateOrderProductDto[];
  shippingMethod?: string;
  customerName?: string;
  customerEmail?: string;
  shippingAddress?: string;
  recipientName?: string;
}
