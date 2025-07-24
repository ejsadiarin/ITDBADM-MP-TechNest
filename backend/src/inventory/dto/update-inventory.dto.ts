import { PartialType } from '@nestjs/mapped-types';
import { CreateInventoryDto } from './create-inventory.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateInventoryDto extends PartialType(CreateInventoryDto) {
  @IsOptional()
  @IsNumber()
  product_id?: number;

  @IsOptional()
  @IsNumber()
  stock_quantity?: number;
}
