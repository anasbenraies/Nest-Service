import { IsEmail, IsNotEmpty, IsNumberString, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNumberString()
  @IsNotEmpty()
  @MinLength(6)
  phone : string 
}