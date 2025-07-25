import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionLog } from './entities/transaction-log.entity';
import { CreateTransactionLogDto } from './dto/create-transaction-log.dto';
import { UpdateTransactionLogDto } from './dto/update-transaction-log.dto';

@Injectable()
export class TransactionLogsService {
  constructor(
    @InjectRepository(TransactionLog)
    private transactionLogsRepository: Repository<TransactionLog>,
  ) {}

  async create(createTransactionLogDto: CreateTransactionLogDto): Promise<TransactionLog> {
    const transactionLog = this.transactionLogsRepository.create(createTransactionLogDto);
    return this.transactionLogsRepository.save(transactionLog);
  }

  async findAll(): Promise<TransactionLog[]> {
    return this.transactionLogsRepository.find();
  }

  async findOne(id: number): Promise<TransactionLog> {
    const transactionLog = await this.transactionLogsRepository.findOne({
      where: { log_id: id },
    });
    if (!transactionLog) {
      throw new NotFoundException(`TransactionLog with ID ${id} not found`);
    }
    return transactionLog;
  }

  async update(
    id: number,
    updateTransactionLogDto: UpdateTransactionLogDto,
  ): Promise<TransactionLog> {
    const transactionLog = await this.findOne(id);
    Object.assign(transactionLog, updateTransactionLogDto);
    return this.transactionLogsRepository.save(transactionLog);
  }

  async remove(id: number): Promise<void> {
    const result = await this.transactionLogsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`TransactionLog with ID ${id} not found`);
    }
  }
}
