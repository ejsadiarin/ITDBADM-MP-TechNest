import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { TransactionLogsService } from '../transaction-logs/transaction-logs.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
    private transactionLogsService: TransactionLogsService,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
  ): Promise<{ new_order_id: number }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result: any[] = await queryRunner.query(
        'CALL CreateOrderFromCart(?, ?)',
        [createOrderDto.user_id, createOrderDto.shipping_address],
      );
      const newOrderId = result[0][0].new_order_id;

      // Fetch the newly created order to get its total_amount
      const newOrder = await this.findOne(newOrderId);

      // Log the transaction using the stored procedure
      await queryRunner.query('CALL LogTransaction(?, ?, ?, ?, ?)', [
        newOrder.user_id,
        newOrder.order_id,
        'Online Payment', // Dummy payment method
        'Completed', // Dummy status
        newOrder.total_amount,
      ]);

      await queryRunner.commitTransaction();
      return { new_order_id: newOrderId };
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

  async findAllByUserId(userId: number): Promise<Order[]> {
    return await this.dataSource.query(
      'SELECT * FROM orders WHERE user_id = ?',
      [userId],
    );
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

  async checkout(
    userId: number,
    shippingAddress: string,
  ): Promise<{ new_order_id: number }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result: any[] = await queryRunner.query(
        'CALL CreateOrderFromCart(?, ?)',
        [userId, shippingAddress],
      );
      const newOrderId = result[0][0].new_order_id;

      // Fetch the newly created order to get its total_amount
      const newOrder = await this.findOne(newOrderId);

      // Log the transaction using the stored procedure
      await queryRunner.query('CALL LogTransaction(?, ?, ?, ?, ?)', [
        newOrder.user_id,
        newOrder.order_id,
        'Online Payment',
        'Completed',
        newOrder.total_amount,
      ]);

      await queryRunner.commitTransaction();
      return { new_order_id: newOrderId };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const oldOrder = await this.findOne(id);

      await queryRunner.query('UPDATE orders SET ? WHERE order_id = ?', [
        updateOrderDto,
        id,
      ]);

      const updatedOrder = await this.findOne(id);

      if (oldOrder.status !== updatedOrder.status) {
        await this.transactionLogsService.create({
          user_id: updatedOrder.user_id,
          action_type: 'ORDER_STATUS_UPDATE',
          table_name: 'orders',
          record_id: updatedOrder.order_id,
          old_value: oldOrder.status,
          new_value: updatedOrder.status,
        });
      }

      await queryRunner.commitTransaction();
      return updatedOrder;
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
