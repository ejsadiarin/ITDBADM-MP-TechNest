import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result: any[] = await queryRunner.query(
        'INSERT INTO cart(user_id) VALUES (?)',
        [createCartDto.user_id],
      );
      await queryRunner.commitTransaction();
      return this.findOne(result[0].insertId);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Cart[]> {
    return await this.dataSource.query('SELECT * FROM cart');
  }

  async findOne(id: number): Promise<Cart> {
    const [cart] = await this.dataSource.query(
      'SELECT * FROM cart WHERE cart_id = ?',
      [id],
    );
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    return cart;
  }

  async findCartByUserId(userId: number): Promise<any> {
    const [cart] = await this.dataSource.query(
      'SELECT * FROM cart WHERE user_id = ?',
      [userId],
    );
    if (!cart) {
      throw new NotFoundException(`Cart for user with ID ${userId} not found`);
    }

    const cartItems = await this.dataSource.query(
      'SELECT * FROM cart_items WHERE cart_id = ?',
      [cart.cart_id],
    );

    return { ...cart, items: cartItems };
  }

  async update(id: number, updateCartDto: UpdateCartDto): Promise<Cart> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.query('UPDATE cart SET ? WHERE cart_id = ?', [
        updateCartDto,
        id,
      ]);
      await queryRunner.commitTransaction();
      return this.findOne(id);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result: any[] = await queryRunner.query(
        'DELETE FROM cart WHERE cart_id = ?',
        [id],
      );
      if (result[0].affectedRows === 0) {
        throw new NotFoundException(`Cart with ID ${id} not found`);
      }
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
