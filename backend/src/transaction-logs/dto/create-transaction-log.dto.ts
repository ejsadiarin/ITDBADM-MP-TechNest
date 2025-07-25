import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAuditLogDto {
  @IsOptional()
  @IsNumber()
  user_id?: number;

  @IsString()
  action_type: string;

  @IsString()
  table_name: string;

  @IsNumber()
  record_id: number;

  @IsOptional()
  @IsString()
  old_value?: string;

  @IsOptional()
  @IsString()
  new_value?: string;
}
