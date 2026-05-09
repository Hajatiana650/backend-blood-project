import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
	IsDate,
	IsInt,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	Min,
} from 'class-validator';

export class CreateAnalysisDto {
	@ApiPropertyOptional({ example: '2026-05-09T00:00:00.000Z' })
	@IsOptional()
	@Type(() => Date)
	@IsDate()
	analysis_date?: Date | string;

	@ApiProperty({ example: 'valid' })
	@IsNotEmpty()
	@IsString()
	result!: string;

	@ApiPropertyOptional({ example: 'https://files.example.com/analysis.pdf' })
	@IsOptional()
	@IsString()
	attachement?: string | null;

	@ApiPropertyOptional({ example: 'Pression stable, bilan normal' })
	@IsOptional()
	@IsString()
	observation?: string | null;

	@ApiProperty({ example: 72.5 })
	@IsNotEmpty()
	@IsNumber()
	weight!: number;

	@ApiProperty({ example: '12/8' })
	@IsNotEmpty()
	@IsString()
	tension!: string;

	@ApiProperty({ example: 1 })
	@Type(() => Number)
	@IsInt()
	@Min(1)
	id_donor!: number;
}
