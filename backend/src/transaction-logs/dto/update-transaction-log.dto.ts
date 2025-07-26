import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionLogDto } from './create-transaction-log.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTransactionLogDto extends PartialType(
  CreateTransactionLogDto,
) {
  @IsOptional()
  @IsNumber()
  user_id?: number;

  @IsOptional()
  @IsString()
  action_type?: string;

  @IsOptional()
  @IsString()
  table_name?: string;

  @IsOptional()
  @IsNumber()
  record_id?: number;

  @IsOptional()
  @IsString()
  old_value?: string;

  @IsOptional()
  @IsString()
  new_value?: string;
}
