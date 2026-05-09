import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsBoolean,
	IsDate,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Min,
} from 'class-validator';

export class CreateDonorDto {
	@ApiProperty({ example: '12 rue des fleurs, Antananarivo' })
	@IsNotEmpty()
	@IsString()
	address!: string;

	@ApiProperty({ example: 'enseignant' })
	@IsNotEmpty()
	@IsString()
	job!: string;

	@ApiProperty({ example: '1995-04-18T00:00:00.000Z' })
	@Type(() => Date)
	@IsDate()
	birth_date!: Date;

	@ApiProperty({ example: true })
	@IsNotEmpty()
	@IsBoolean()
	availability!: boolean;

	@ApiProperty({ example: 'https://cdn.example.com/photo.jpg', required: false })
	@IsOptional()
	@IsString()
	photo?: string | null;

	@ApiProperty({ example: '123456ABC' })
	@IsNotEmpty()
	@IsString()
	CIN!: string;

	@ApiProperty({ example: 72.5 })
	@Type(() => Number)
	@IsNumber()
	weight!: number;

	@ApiProperty({ example: 1 })
	@Type(() => Number)
	@IsInt()
	@Min(1)
	id_user!: number;

	@ApiProperty({ example: 2 })
	@Type(() => Number)
	@IsInt()
	@Min(1)
	id_blood!: number;
}
