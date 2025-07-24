import { PartialType } from '@nestjs/mapped-types';
import { CreateCartItemDto } from './create-cart-item.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateCartItemDto extends PartialType(CreateCartItemDto) {
  @IsOptional()
  @IsNumber()
  cart_id?: number;

  @IsOptional()
  @IsNumber()
  product_id?: number;

  @IsOptional()
  @IsNumber()
  quantity?: number;
}
