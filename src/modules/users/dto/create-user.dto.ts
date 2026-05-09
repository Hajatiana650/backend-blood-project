import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';

import { Role } from 'generated/prisma/enums';

export class CreateUserDto {
  
  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsNotEmpty()
  @IsString()
  firstname!: string;

  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  @MinLength(6)
  password!: string;

  @IsNotEmpty()
  @IsEnum(Role)
  role!: Role;

  @IsNotEmpty()
  @IsString()
  @Matches(/^[0-9+\s-]+$/, {
    message: 'Invalid phone number format',
  })
  phone_number!: string;
}