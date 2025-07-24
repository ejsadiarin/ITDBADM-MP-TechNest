import { IsNumber } from 'class-validator';

export class CreateCartItemDto {
  @IsNumber()
  cart_id: number;

  @IsNumber()
  product_id: number;

  @IsNumber()
  quantity: number;
}
