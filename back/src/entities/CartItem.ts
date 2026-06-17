import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from "typeorm";
import { Product } from "./Product";
import { User } from "./User";

@Entity({ name: "cart_items" })
@Unique(["user", "product"])
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.cartItems, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @ManyToOne(() => Product, { eager: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "productId" })
  product: Product;

  @Column()
  quantity: number;
}
