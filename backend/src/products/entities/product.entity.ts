import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  category_id: number;

  @Column({ nullable: true })
  image_url: string;

  @Column({ nullable: true })
  brand: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: true })
  currency_id: number;

  // Assuming a Category entity exists and there's a many-to-one relationship
  // @ManyToOne(() => Category, category => category.products)
  // @JoinColumn({ name: 'category_id' })
  // category: Category;
}
