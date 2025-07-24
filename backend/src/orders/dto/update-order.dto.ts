import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  IsDecimal,
} from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @IsNumber()
  user_id?: number;

  @IsOptional()
  @IsDecimal()
  total_amount?: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  shipping_address?: string;
}
