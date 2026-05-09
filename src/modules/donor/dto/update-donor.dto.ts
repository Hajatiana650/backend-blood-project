import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateDonorDto } from './create-donor.dto';

export class UpdateDonorDto extends PartialType(CreateDonorDto) {
	@ApiPropertyOptional({ example: false })
	@IsOptional()
	@IsBoolean()
	isApte?: boolean;
}
