import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { AuthModule } from '../auth/auth.module';
import { TransactionLogsModule } from '../transaction-logs/transaction-logs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), AuthModule, TransactionLogsModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService, TypeOrmModule],
})
export class OrdersModule {}
