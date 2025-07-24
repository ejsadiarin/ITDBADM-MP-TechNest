import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Cart } from '../../cart/entities/cart.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  cart_item_id: number;

  @Column()
  cart_id: number;

  @Column()
  product_id: number;

  @Column()
  quantity: number;

  @CreateDateColumn()
  added_at: Date;

  @ManyToOne(() => Cart, (cart) => cart.cart_items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.product_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
