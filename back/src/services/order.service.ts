import { CreateOrderDto } from "../dtos/createOrderDto";
import { Order } from "../entities/Order";
import { OrderDetail } from "../entities/OrderDetail";
import { OrderRepository } from "../repositories/order.repository";
import { ProductRepository } from "../repositories/product.repository";
import { UserRepository } from "../repositories/user.repository";

export const createOrderService = async (
  createOrderDto: CreateOrderDto
): Promise<Order | null> => {
  const userF = await UserRepository.findOneBy({ id: createOrderDto.userId });

  if (!userF) throw new Error("User not found");

  const newOrder = OrderRepository.create();
  newOrder.status = "approved";
  newOrder.date = new Date();
  newOrder.user = userF;
  newOrder.subtotal = createOrderDto.subtotal;
  newOrder.shippingMethod = createOrderDto.shippingMethod;
  newOrder.shippingCost = createOrderDto.shippingCost;
  newOrder.discount = createOrderDto.discount;
  newOrder.total = createOrderDto.total;
  newOrder.items = [];

  for (const item of createOrderDto.products) {
    const product = await ProductRepository.findOneBy({
      id: item.productId,
    });

    if (!product) throw new Error("Product not found");

    const orderDetail = new OrderDetail();
    orderDetail.product = product;
    orderDetail.quantity = item.quantity;
    orderDetail.order = newOrder;

    newOrder.items.push(orderDetail);
  }

  const savedOrder = await OrderRepository.save(newOrder);

  const order = await OrderRepository.findOne({
    where: { id: savedOrder.id },
    relations: ["items", "items.product"],
  });

  return order;
};