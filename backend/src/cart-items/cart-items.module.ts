import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItemsService } from './cart-items.service';
import { CartItemsController } from './cart-items.controller';
import { CartItem } from './entities/cart-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem])],
  controllers: [CartItemsController],
  providers: [CartItemsService],
  exports: [CartItemsService, TypeOrmModule],
})
export class CartItemsModule {}
