import { IsNumber } from 'class-validator';

export class CreateCartDto {
  @IsNumber()
  user_id: number;
}
