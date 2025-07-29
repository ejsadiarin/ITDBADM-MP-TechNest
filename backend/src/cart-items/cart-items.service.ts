import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartItemsService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async create(createCartItemDto: CreateCartItemDto): Promise<CartItem> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const [existingItem] = await queryRunner.query(
        'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?',
        [createCartItemDto.cart_id, createCartItemDto.product_id],
      );

      if (existingItem) {
        // If item already exists, update quantity
        await queryRunner.query(
          'UPDATE cart_items SET quantity = quantity + ? WHERE cart_item_id = ?',
          [createCartItemDto.quantity, existingItem.cart_item_id],
        );
        await queryRunner.commitTransaction();
        return this.findOne(existingItem.cart_item_id);
      } else {
        // If item does not exist, insert new item
        const result: any = await queryRunner.query(
          'INSERT INTO cart_items(cart_id, product_id, quantity) VALUES (?, ?, ?)',
          [
            createCartItemDto.cart_id,
            createCartItemDto.product_id,
            createCartItemDto.quantity,
          ],
        );
        const insertId = result.insertId;
        await queryRunner.commitTransaction();
        return this.findOne(insertId);
      }
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<CartItem[]> {
    return await this.dataSource.query('SELECT * FROM cart_items');
  }

  async findOne(id: number): Promise<CartItem> {
    const [cartItem] = await this.dataSource.query(
      'SELECT * FROM cart_items WHERE cart_item_id = ?',
      [id],
    );
    if (!cartItem) {
      throw new NotFoundException(`CartItem with ID ${id} not found`);
    }
    return cartItem;
  }

  async update(
    id: number,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.query(
        'UPDATE cart_items SET ? WHERE cart_item_id = ?',
        [updateCartItemDto, id],
      );
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
      const result: any = await queryRunner.query(
        'DELETE FROM cart_items WHERE cart_item_id = ?',
        [id],
      );
      if (result.affectedRows === 0) {
        throw new NotFoundException(`CartItem with ID ${id} not found`);
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
