import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result: any[] = await queryRunner.query(
        'INSERT INTO orders(user_id, total_amount, status, shipping_address) VALUES (?, ?, ?, ?)',
        [
          createOrderDto.user_id,
          createOrderDto.total_amount,
          createOrderDto.status,
          createOrderDto.shipping_address,
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

  async findAll(): Promise<Order[]> {
    return await this.dataSource.query('SELECT * FROM orders');
  }

  async findOne(id: number): Promise<Order> {
    const [order] = await this.dataSource.query(
      'SELECT * FROM orders WHERE order_id = ?',
      [id],
    );
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.query('UPDATE orders SET ? WHERE order_id = ?', [
        updateOrderDto,
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
        'DELETE FROM orders WHERE order_id = ?',
        [id],
      );
      if (result[0].affectedRows === 0) {
        throw new NotFoundException(`Order with ID ${id} not found`);
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
