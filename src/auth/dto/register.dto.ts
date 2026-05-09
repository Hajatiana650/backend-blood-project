import { IsEmail, IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class RegisterDto {
  @IsString() @IsNotEmpty()
  name: string;

  @IsString() @IsNotEmpty()
  firstname: string;

  @IsEmail()
  email: string;

  @IsString() @IsNotEmpty()
  password: string;

  @IsOptional() @IsString()
  phone_number?: string;

  @IsString() @IsNotEmpty()
  CIN: string;

  @IsDateString()
  birth_date: string;

  @IsOptional() @IsString()
  address?: string;

  @IsOptional() @IsString()
  job?: string;

  @IsOptional() @IsString()
  photo?: string;
}
