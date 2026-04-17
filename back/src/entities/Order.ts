import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";
import { OrderDetail } from "./OrderDetail";

@Entity({ name: "orders" })
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;

  @Column()
  date: Date;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  subtotal: number;

  @Column({ default: "standard" })
  shippingMethod: string;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  shippingCost: number;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  discount: number;

  @Column("decimal", { precision: 10, scale: 2, default: 0 })
  total: number;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: "userId" })
  user: User;

  @OneToMany(() => OrderDetail, (detail) => detail.order, {
    cascade: true,
    eager: true,
  })
  items: OrderDetail[];
}