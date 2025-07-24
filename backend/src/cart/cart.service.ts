import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartsRepository: Repository<Cart>,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const cart = this.cartsRepository.create(createCartDto);
    return this.cartsRepository.save(cart);
  }

  async findAll(): Promise<Cart[]> {
    return this.cartsRepository.find();
  }

  async findOne(id: number): Promise<Cart> {
    const cart = await this.cartsRepository.findOne({ where: { cart_id: id } });
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    return cart;
  }

  async update(id: number, updateCartDto: UpdateCartDto): Promise<Cart> {
    const cart = await this.findOne(id);
    Object.assign(cart, updateCartDto);
    return this.cartsRepository.save(cart);
  }

  async remove(id: number): Promise<void> {
    const result = await this.cartsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
  }
}
