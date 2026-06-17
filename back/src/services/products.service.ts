import { Product } from "../entities/Product";
import { ProductRepository } from "../repositories/product.repository";
import { ClientError } from "../utils/errors";

export const checkProductExists = async (itemId: number): Promise<boolean> => {
  const item: Product | null = await ProductRepository.findOneBy({
    id: itemId,
  });
  return !!item;
};

export const getProductsService = async (): Promise<Product[]> => {
  return await ProductRepository.find({
    relations: ["category"],
    order: {
      id: "ASC",
    },
  });
};

type ProductUpdatePayload = Partial<
  Pick<
    Product,
    "name" | "description" | "price" | "stock" | "image" | "categoryId" | "isOffer"
  >
>;

export const updateProductService = async (
  productId: number,
  payload: ProductUpdatePayload
): Promise<Product> => {
  const product = await ProductRepository.findOne({
    where: { id: productId },
    relations: ["category"],
  });

  if (!product) {
    throw new ClientError("Product not found", 404);
  }

  const nextName = payload.name?.trim();
  const nextDescription = payload.description?.trim();
  const nextImage = payload.image?.trim();

  if (nextName !== undefined) {
    if (!nextName) throw new ClientError("Product name is required");
    product.name = nextName;
  }

  if (nextDescription !== undefined) {
    if (!nextDescription) throw new ClientError("Description is required");
    product.description = nextDescription;
  }

  if (nextImage !== undefined) {
    if (!nextImage) throw new ClientError("Image URL is required");
    product.image = nextImage;
  }

  if (payload.price !== undefined) {
    const price = Number(payload.price);
    if (!Number.isFinite(price) || price < 0) {
      throw new ClientError("Price must be a valid positive number");
    }
    product.price = Math.round(price);
  }

  if (payload.stock !== undefined) {
    const stock = Number(payload.stock);
    if (!Number.isInteger(stock) || stock < 0) {
      throw new ClientError("Stock must be a valid positive integer");
    }
    product.stock = stock;
  }

  if (payload.categoryId !== undefined) {
    const categoryId = Number(payload.categoryId);
    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      throw new ClientError("Category is invalid");
    }
    product.categoryId = categoryId;
  }

  if (payload.isOffer !== undefined) {
    product.isOffer = Boolean(payload.isOffer);
  }

  const savedProduct = await ProductRepository.save(product);
  const updatedProduct = await ProductRepository.findOne({
    where: { id: savedProduct.id },
    relations: ["category"],
  });

  if (!updatedProduct) {
    throw new ClientError("Product not found after update", 404);
  }

  return updatedProduct;
};
