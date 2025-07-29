import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Currency } from './entities/currency.entity';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';

@Injectable()
export class CurrenciesService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async create(createCurrencyDto: CreateCurrencyDto): Promise<Currency> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result: any = await queryRunner.query(
        'INSERT INTO currencies(currency_code, symbol, exchange_rate_to_usd) VALUES (?, ?, ?)',
        [
          createCurrencyDto.currency_code,
          createCurrencyDto.symbol,
          createCurrencyDto.exchange_rate_to_usd,
        ],
      );
      const insertId = result.insertId;
      await queryRunner.commitTransaction();
      return this.findOne(insertId);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Currency[]> {
    return await this.dataSource.query('SELECT * FROM currencies');
  }

  async findOne(id: number): Promise<Currency> {
    const [currency] = await this.dataSource.query(
      'SELECT * FROM currencies WHERE currency_id = ?',
      [id],
    );
    if (!currency) {
      throw new NotFoundException(`Currency with ID ${id} not found`);
    }
    return currency;
  }

  async update(
    id: number,
    updateCurrencyDto: UpdateCurrencyDto,
  ): Promise<Currency> {
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.query('UPDATE currencies SET ? WHERE currency_id = ?', [
        updateCurrencyDto,
        id,
      ]);
      return this.findOne(id);
    });
  }

  async remove(id: number): Promise<void> {
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      const result: any[] = await transactionalEntityManager.query(
        'DELETE FROM currencies WHERE currency_id = ?',
        [id],
      );
      if (result[0].affectedRows === 0) {
        throw new NotFoundException(`Currency with ID ${id} not found`);
      }
    });
  }
}
