import { IsString, IsEmail, IsOptional } from 'class-validator';
import { UserRole } from 'src/users/entities/user.entity';

export class RegisterAuthDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string; // This should be hashed in a real application

  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsString()
  role: UserRole;
}
