import {
  IsNumber,
  IsString,
  IsEnum,
  IsOptional,
  IsDecimal,
} from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class CreateOrderDto {
  @IsNumber()
  user_id: number;

  @IsOptional()
  @IsDecimal()
  total_amount?: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsString()
  shipping_address: string;
}
