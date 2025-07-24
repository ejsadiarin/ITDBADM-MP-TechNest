import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn()
  inventory_id: number;

  @Column({ unique: true })
  product_id: number;

  @Column({ default: 0 })
  stock_quantity: number;

  @UpdateDateColumn()
  last_updated: Date;

  @OneToOne(() => Product, (product) => product.product_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
