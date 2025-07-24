import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
  ) {}

  async create(createInventoryDto: CreateInventoryDto): Promise<Inventory> {
    const inventory = this.inventoryRepository.create(createInventoryDto);
    return this.inventoryRepository.save(inventory);
  }

  async findAll(): Promise<Inventory[]> {
    return this.inventoryRepository.find();
  }

  async findOne(id: number): Promise<Inventory> {
    const inventory = await this.inventoryRepository.findOne({
      where: { inventory_id: id },
    });
    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }
    return inventory;
  }

  async update(
    id: number,
    updateInventoryDto: UpdateInventoryDto,
  ): Promise<Inventory> {
    const inventory = await this.findOne(id);
    Object.assign(inventory, updateInventoryDto);
    return this.inventoryRepository.save(inventory);
  }

  async remove(id: number): Promise<void> {
    const result = await this.inventoryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }
  }
}
