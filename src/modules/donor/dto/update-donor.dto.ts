import { IsOptional, IsString, IsBoolean, IsNumber, IsInt } from 'class-validator';

export class UpdateDonorDto {
  @IsOptional() @IsString()
  address?: string;

  @IsOptional() @IsString()
  job?: string;

  @IsOptional() @IsBoolean()
  availability?: boolean;

  @IsOptional() @IsString()
  photo?: string;

  @IsOptional() @IsBoolean()
  isApte?: boolean;

  @IsOptional() @IsNumber()
  weight?: number;

  @IsOptional() @IsInt()
  id_blood?: number;
}
