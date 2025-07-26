import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result: any[] = await queryRunner.query(
        'INSERT INTO products(name, description, price, category_id, image_url, brand) VALUES (?, ?, ?, ?, ?, ?)',
        [
          createProductDto.name,
          createProductDto.description,
          createProductDto.price,
          createProductDto.category_id,
          createProductDto.image_url,
          createProductDto.brand,
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

  async findAll(): Promise<Product[]> {
    return await this.dataSource.query('SELECT * FROM products');
  }

  async findOne(id: number): Promise<Product> {
    const [product] = await this.dataSource.query(
      'SELECT * FROM products WHERE product_id = ?',
      [id],
    );
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.query('UPDATE products SET ? WHERE product_id = ?', [
        updateProductDto,
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
        'DELETE FROM products WHERE product_id = ?',
        [id],
      );
      if (result[0].affectedRows === 0) {
        throw new NotFoundException(`Product with ID ${id} not found`);
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
