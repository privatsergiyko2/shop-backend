import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  name:string;
  @IsEmail()
  @IsNotEmpty()
  email:string;
  @MinLength(6)
  @IsNotEmpty()
  @IsString()
  password:string;
}
