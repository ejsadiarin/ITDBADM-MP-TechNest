import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async create(createInventoryDto: CreateInventoryDto): Promise<Inventory> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result: any[] = await queryRunner.query(
        'INSERT INTO inventory(product_id, stock_quantity) VALUES (?, ?)',
        [createInventoryDto.product_id, createInventoryDto.stock_quantity],
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

  async findAll(): Promise<Inventory[]> {
    return await this.dataSource.query('SELECT * FROM inventory');
  }

  async findOne(id: number): Promise<Inventory> {
    const [inventory] = await this.dataSource.query(
      'SELECT * FROM inventory WHERE inventory_id = ?',
      [id],
    );
    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }
    return inventory;
  }

  async update(
    id: number,
    updateInventoryDto: UpdateInventoryDto,
  ): Promise<Inventory> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.query('UPDATE inventory SET ? WHERE inventory_id = ?', [
        updateInventoryDto,
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
        'DELETE FROM inventory WHERE inventory_id = ?',
        [id],
      );
      if (result[0].affectedRows === 0) {
        throw new NotFoundException(`Inventory with ID ${id} not found`);
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
