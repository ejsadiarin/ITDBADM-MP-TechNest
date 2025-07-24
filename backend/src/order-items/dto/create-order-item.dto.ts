import { IsNumber, IsDecimal } from 'class-validator';

export class CreateOrderItemDto {
  @IsNumber()
  order_id: number;

  @IsNumber()
  product_id: number;

  @IsNumber()
  quantity: number;

  @IsDecimal()
  price_at_purchase: number;
}
