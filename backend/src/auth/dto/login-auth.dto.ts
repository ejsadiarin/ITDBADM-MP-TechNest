import { IsString, IsEmail } from 'class-validator';

export class LoginAuthDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string; // This should be hashed in a real application
}
