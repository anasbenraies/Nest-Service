import { IsEmail, IsNumberString, IsString } from "class-validator";
import { PartialType } from '@nestjs/mapped-types';


export class CreateCommentDto {
  @IsString()
  readonly text: string;
}


export class UpdateCommentDto extends PartialType(CreateCommentDto){}
