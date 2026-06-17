import { CreateOrderDto } from "../dtos/createOrderDto";
import { Order } from "../entities/Order";
import { OrderDetail } from "../entities/OrderDetail";
import { AppDataSource } from "../config/dataSource";
import { CartItem } from "../entities/CartItem";
import { OrderRepository } from "../repositories/order.repository";
import { ProductRepository } from "../repositories/product.repository";
import { UserRepository } from "../repositories/user.repository";
import { ClientError } from "../utils/errors";

const SHIPPING_COSTS: Record<string, number> = {
  standard: 0,
  express: 10,
  premium: 20,
};

export const createOrderService = async (
  createOrderDto: CreateOrderDto
): Promise<Order | null> => {
  const shippingMethod = createOrderDto.shippingMethod || "standard";

  if (!(shippingMethod in SHIPPING_COSTS)) {
    throw new ClientError("Invalid shipping method");
  }

  return AppDataSource.transaction(async (manager) => {
    const userF = await manager.findOneBy(UserRepository.target, {
      id: createOrderDto.userId,
    });

    if (!userF) throw new ClientError("User not found", 404);

    let subtotal = 0;
    const orderItems: OrderDetail[] = [];

    for (const item of createOrderDto.products) {
      const product = await manager.findOne(ProductRepository.target, {
        where: { id: item.productId },
        lock: { mode: "pessimistic_write" },
      });

      if (!product) throw new ClientError("Product not found", 404);

      if (product.stock < item.quantity) {
        throw new ClientError(
          `Not enough stock for ${product.name}. Available: ${product.stock}`
        );
      }

      const nextStock = product.stock - item.quantity;
      await manager.query("UPDATE products SET stock = $1 WHERE id = $2", [
        nextStock,
        product.id,
      ]);
      product.stock = nextStock;

      orderItems.push(manager.create(OrderDetail, {
        product,
        quantity: item.quantity,
      }));

      subtotal += Number(product.price) * item.quantity;
    }

    const shippingCost = SHIPPING_COSTS[shippingMethod];
    const discount = 0;
    const total = subtotal + shippingCost - discount;

    const newOrder = manager.create(OrderRepository.target, {
      status: "pending_payment",
      date: new Date(),
      user: userF,
      shippingMethod,
      shippingCost,
      customerName: createOrderDto.customerName || userF.name,
      customerEmail: createOrderDto.customerEmail || userF.email,
      shippingAddress: createOrderDto.shippingAddress || userF.address,
      recipientName: createOrderDto.recipientName || userF.name,
      discount,
      subtotal,
      total,
    });

    const savedOrder = await manager.save(OrderRepository.target, newOrder);
    const details = orderItems.map((orderItem) => ({
      ...orderItem,
      order: savedOrder,
    }));

    await manager.save(OrderDetail, details);
    await manager.delete(CartItem, { user: { id: userF.id } });

    return manager.findOne(OrderRepository.target, {
      where: { id: savedOrder.id },
      relations: ["items", "items.product"],
    });
  });
};
