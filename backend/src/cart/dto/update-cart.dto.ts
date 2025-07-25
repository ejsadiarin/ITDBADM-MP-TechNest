import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateCartDto extends PartialType(CreateCartDto) {
  @IsOptional()
  @IsNumber()
  user_id?: number;
}
