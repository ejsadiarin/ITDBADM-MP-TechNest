import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderItemDto } from './create-order-item.dto';
import { IsNumber, IsOptional, IsDecimal } from 'class-validator';

export class UpdateOrderItemDto extends PartialType(CreateOrderItemDto) {
  @IsOptional()
  @IsNumber()
  order_id?: number;

  @IsOptional()
  @IsNumber()
  product_id?: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;

  @IsOptional()
  @IsDecimal()
  price_at_purchase?: number;
}
