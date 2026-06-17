import { AppDataSource } from "../config/dataSource";
import { CartItem } from "../entities/CartItem";
import { Product } from "../entities/Product";
import { User } from "../entities/User";
import { ClientError } from "../utils/errors";

const cartRepository = AppDataSource.getRepository(CartItem);
const productRepository = AppDataSource.getRepository(Product);
const userRepository = AppDataSource.getRepository(User);

export const getCartService = async (userId: number) => {
  return cartRepository.find({
    where: { user: { id: userId } },
    relations: ["product"],
    order: { id: "ASC" },
  });
};

export const addCartItemService = async (userId: number, productId: number) => {
  const user = await userRepository.findOneBy({ id: userId });
  const product = await productRepository.findOneBy({ id: productId });

  if (!user) throw new ClientError("User not found", 404);
  if (!product) throw new ClientError("Product not found", 404);
  if (product.stock <= 0) throw new ClientError("Product is out of stock");

  let item = await cartRepository.findOne({
    where: { user: { id: userId }, product: { id: productId } },
    relations: ["product", "user"],
  });

  if (item) {
    if (item.quantity >= product.stock) {
      throw new ClientError("No more stock available");
    }

    item.quantity += 1;
  } else {
    item = cartRepository.create({
      user,
      product,
      quantity: 1,
    });
  }

  await cartRepository.save(item);
  return getCartService(userId);
};

export const updateCartItemService = async (
  userId: number,
  productId: number,
  quantity: number
) => {
  if (!Number.isInteger(quantity) || quantity < 0) {
    throw new ClientError("Invalid quantity");
  }

  const item = await cartRepository.findOne({
    where: { user: { id: userId }, product: { id: productId } },
    relations: ["product", "user"],
  });

  if (!item) throw new ClientError("Cart item not found", 404);

  if (quantity === 0) {
    await cartRepository.remove(item);
    return getCartService(userId);
  }

  if (quantity > item.product.stock) {
    throw new ClientError("No more stock available");
  }

  item.quantity = quantity;
  await cartRepository.save(item);

  return getCartService(userId);
};

export const removeCartItemService = async (
  userId: number,
  productId: number
) => {
  const item = await cartRepository.findOne({
    where: { user: { id: userId }, product: { id: productId } },
  });

  if (item) {
    await cartRepository.remove(item);
  }

  return getCartService(userId);
};

export const clearCartService = async (userId: number) => {
  await cartRepository.delete({ user: { id: userId } });
  return [];
};
