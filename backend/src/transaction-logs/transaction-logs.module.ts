import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionLogsService } from './transaction-logs.service';
import { TransactionLogsController } from './transaction-logs.controller';
import { TransactionLog } from './entities/transaction-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionLog])],
  controllers: [TransactionLogsController],
  providers: [TransactionLogsService],
  exports: [TransactionLogsService, TypeOrmModule],
})
export class TransactionLogsModule {}
