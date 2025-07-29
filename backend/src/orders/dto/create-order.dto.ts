import {
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  user_id: number;

  @IsString()
  shipping_address: string;
}
