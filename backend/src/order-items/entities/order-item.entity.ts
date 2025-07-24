import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  order_item_id: number;

  @Column()
  order_id: number;

  @Column()
  product_id: number;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price_at_purchase: number;

  @ManyToOne(() => Order, (order) => order.order_items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product, (product) => product.product_id)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
