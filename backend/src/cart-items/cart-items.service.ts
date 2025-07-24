import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartItemsService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemsRepository: Repository<CartItem>,
  ) {}

  async create(createCartItemDto: CreateCartItemDto): Promise<CartItem> {
    const cartItem = this.cartItemsRepository.create(createCartItemDto);
    return this.cartItemsRepository.save(cartItem);
  }

  async findAll(): Promise<CartItem[]> {
    return this.cartItemsRepository.find();
  }

  async findOne(id: number): Promise<CartItem> {
    const cartItem = await this.cartItemsRepository.findOne({
      where: { cart_item_id: id },
    });
    if (!cartItem) {
      throw new NotFoundException(`CartItem with ID ${id} not found`);
    }
    return cartItem;
  }

  async update(
    id: number,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem> {
    const cartItem = await this.findOne(id);
    Object.assign(cartItem, updateCartItemDto);
    return this.cartItemsRepository.save(cartItem);
  }

  async remove(id: number): Promise<void> {
    const result = await this.cartItemsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`CartItem with ID ${id} not found`);
    }
  }
}
