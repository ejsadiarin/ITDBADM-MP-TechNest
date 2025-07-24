import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
  ) {}

  async create(createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    const orderItem = this.orderItemsRepository.create(createOrderItemDto);
    return this.orderItemsRepository.save(orderItem);
  }

  async findAll(): Promise<OrderItem[]> {
    return this.orderItemsRepository.find();
  }

  async findOne(id: number): Promise<OrderItem> {
    const orderItem = await this.orderItemsRepository.findOne({
      where: { order_item_id: id },
    });
    if (!orderItem) {
      throw new NotFoundException(`OrderItem with ID ${id} not found`);
    }
    return orderItem;
  }

  async update(
    id: number,
    updateOrderItemDto: UpdateOrderItemDto,
  ): Promise<OrderItem> {
    const orderItem = await this.findOne(id);
    Object.assign(orderItem, updateOrderItemDto);

    return this.orderItemsRepository.save(orderItem);
  }

  async remove(id: number): Promise<void> {
    const result = await this.orderItemsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`OrderItem with ID ${id} not found`);
    }
  }
}
