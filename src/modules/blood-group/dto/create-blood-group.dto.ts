import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { BloodType } from 'generated/prisma/enums';

export class CreateBloodGroupDto {
	@ApiProperty({ example: 'A+' })
	@IsNotEmpty()
	@IsString()
	type_blood!: BloodType;
}
