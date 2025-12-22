import { IsEmail, IsNumberString, IsString } from "class-validator";
import { PartialType } from '@nestjs/mapped-types';


export class CreateUserDto {
  @IsString()
  readonly name: string;
  @IsEmail()
  readonly email: string;
  @IsNumberString()
  readonly phone: string;
  @IsString()
  readonly password: string;


}


export class UpdateUserDto extends PartialType(CreateUserDto){}
