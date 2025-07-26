import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async create(createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result: any[] = await queryRunner.query(
        'INSERT INTO order_items(order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)',
        [
          createOrderItemDto.order_id,
          createOrderItemDto.product_id,
          createOrderItemDto.quantity,
          createOrderItemDto.price_at_purchase,
        ],
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

  async findAll(): Promise<OrderItem[]> {
    return await this.dataSource.query('SELECT * FROM order_items');
  }

  async findOne(id: number): Promise<OrderItem> {
    const [orderItem] = await this.dataSource.query(
      'SELECT * FROM order_items WHERE order_item_id = ?',
      [id],
    );
    if (!orderItem) {
      throw new NotFoundException(`OrderItem with ID ${id} not found`);
    }
    return orderItem;
  }

  async update(
    id: number,
    updateOrderItemDto: UpdateOrderItemDto,
  ): Promise<OrderItem> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.query(
        'UPDATE order_items SET ? WHERE order_item_id = ?',
        [updateOrderItemDto, id],
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
      const result: any[] = await queryRunner.query(
        'DELETE FROM order_items WHERE order_item_id = ?',
        [id],
      );
      if (result[0].affectedRows === 0) {
        throw new NotFoundException(`OrderItem with ID ${id} not found`);
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
