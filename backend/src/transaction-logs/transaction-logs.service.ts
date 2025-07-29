import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TransactionLog } from './entities/transaction-log.entity';
import { CreateTransactionLogDto } from './dto/create-transaction-log.dto';
import { UpdateTransactionLogDto } from './dto/update-transaction-log.dto';

@Injectable()
export class TransactionLogsService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async create(
    createTransactionLogDto: CreateTransactionLogDto,
  ): Promise<TransactionLog> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result: any = await queryRunner.query(
        'INSERT INTO transaction_logs(user_id, action_type, table_name, record_id, old_value, new_value) VALUES (?, ?, ?, ?, ?, ?)',
        [
          createTransactionLogDto.user_id,
          createTransactionLogDto.action_type,
          createTransactionLogDto.table_name,
          createTransactionLogDto.record_id,
          createTransactionLogDto.old_value,
          createTransactionLogDto.new_value,
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

  async findAll(): Promise<TransactionLog[]> {
    return await this.dataSource.query('SELECT * FROM transaction_logs');
  }

  async findOne(id: number): Promise<TransactionLog> {
    const [transactionLog] = await this.dataSource.query(
      'SELECT * FROM transaction_logs WHERE log_id = ?',
      [id],
    );
    if (!transactionLog) {
      throw new NotFoundException(`TransactionLog with ID ${id} not found`);
    }
    return transactionLog;
  }

  async update(
    id: number,
    updateTransactionLogDto: UpdateTransactionLogDto,
  ): Promise<TransactionLog> {
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.query(
        'UPDATE transaction_logs SET ? WHERE log_id = ?',
        [updateTransactionLogDto, id],
      );
      return this.findOne(id);
    });
  }

  async remove(id: number): Promise<void> {
    return this.dataSource.transaction(async (transactionalEntityManager) => {
      const result: any[] = await transactionalEntityManager.query(
        'DELETE FROM transaction_logs WHERE log_id = ?',
        [id],
      );
      if (result[0].affectedRows === 0) {
        throw new NotFoundException(`TransactionLog with ID ${id} not found`);
      }
    });
  }
}
