import {
	Body,
	Controller,
	Get,
	Logger,
	Param,
	ParseEnumPipe,
	ParseIntPipe,
	Post,
	Delete
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BloodGroupService } from './blood-group.service';
import { CreateBloodGroupDto } from './dto/create-blood-group.dto';
import { BloodType } from 'generated/prisma/enums';

@ApiTags('blood-groups')
@Controller('blood-groups')
export class BloodGroupController {
	private readonly logger = new Logger(BloodGroupController.name);

	constructor(private readonly bloodGroupService: BloodGroupService) {}

    

	@Get()
	@ApiOperation({ summary: 'Lister tous les groupes sanguins' })
	@ApiResponse({ status: 200, description: 'Liste des groupes sanguins' })
	async findAll() {
		this.logger.log('Fetching blood groups');
		return this.bloodGroupService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Récupérer un groupe sanguin par identifiant' })
	@ApiParam({ name: 'id', type: Number })
	async findOne(@Param('id', ParseIntPipe) id: number) {
		return this.bloodGroupService.findOne(id);
	}

	@Post()
	@ApiOperation({ summary: 'Créer un groupe sanguin' })
	@ApiBody({ type: CreateBloodGroupDto })
	async create(@Body() createBloodGroupDto: CreateBloodGroupDto) {
		return this.bloodGroupService.create(createBloodGroupDto);
	}

	@Get('can-donate/:donor/:receiver')
	@ApiOperation({
		summary: 'Vérifie si un donneur peut donner à un receveur',
	})
	@ApiParam({
		name: 'donor',
		enum: BloodType,
		example: BloodType.O_NEG,
	})
	@ApiParam({
		name: 'receiver',
		enum: BloodType,
		example: BloodType.A_POS,
	})
	@ApiResponse({
		status: 200,
		description: 'Résultat compatibilité don',
		schema: {
			example: {
				donor: 'O_NEG',
				receiver: 'A_POS',
				canDonate: true,
			},
		},
	})
	canDonate(
		@Param('donor', new ParseEnumPipe(BloodType)) donor: BloodType,
		@Param('receiver', new ParseEnumPipe(BloodType)) receiver: BloodType,
	) {
		return {
			donor,
			receiver,
			canDonate: this.bloodGroupService.canDonate(donor, receiver),
		};
	}

	@Get('can-receive/:receiver/:donor')
	@ApiOperation({
		summary: 'Vérifie si un receveur peut recevoir un sang',
	})
	@ApiParam({
		name: 'receiver',
		enum: BloodType,
		example: BloodType.A_POS,
	})
	@ApiParam({
		name: 'donor',
		enum: BloodType,
		example: BloodType.O_NEG,
	})
	@ApiResponse({
		status: 200,
		description: 'Résultat compatibilité réception',
		schema: {
			example: {
				receiver: 'A_POS',
				donor: 'O_NEG',
				canReceive: true,
			},
		},
	})
	canReceive(
		@Param('receiver', new ParseEnumPipe(BloodType)) receiver: BloodType,
		@Param('donor', new ParseEnumPipe(BloodType)) donor: BloodType,
	) {
		return {
			receiver,
			donor,
			canReceive: this.bloodGroupService.canReceive(receiver, donor),
		};
	}

	@Get('compatible-donors/:receiver')
	@ApiOperation({
		summary: 'Retourne tous les groupes sanguins compatibles pour donner à un receveur',
	})
	@ApiParam({
		name: 'receiver',
		enum: BloodType,
		example: BloodType.A_POS,
	})
	@ApiResponse({
		status: 200,
		description: 'Liste des donneurs compatibles',
		schema: {
			example: {
				receiver: 'A_POS',
				compatibleDonors: ['O_NEG', 'O_POS', 'A_NEG', 'A_POS'],
			},
		},
	})
	getCompatibleDonors(
		@Param('receiver', new ParseEnumPipe(BloodType)) receiver: BloodType,
	) {
		return {
			receiver,
			compatibleDonors: this.bloodGroupService.getCompatibleDonors(receiver),
		};
	}

	@Get('compatible-receivers/:donor')
	@ApiOperation({
		summary: 'Retourne tous les groupes pouvant recevoir le sang du donneur',
	})
	@ApiParam({
		name: 'donor',
		enum: BloodType,
		example: BloodType.O_NEG,
	})
	@ApiResponse({
		status: 200,
		description: 'Liste des receveurs compatibles',
		schema: {
			example: {
				donor: 'O_NEG',
				compatibleReceivers: [
					'O_NEG',
					'O_POS',
					'A_NEG',
					'A_POS',
					'B_NEG',
					'B_POS',
					'AB_NEG',
					'AB_POS',
				],
			},
		},
	})
	getCompatibleReceivers(
		@Param('donor', new ParseEnumPipe(BloodType)) donor: BloodType,
	) {
		return {
			donor,
			compatibleReceivers: this.bloodGroupService.getCompatibleReceivers(donor),
		};
	}

    @Delete(':id')
    @ApiOperation({ summary: 'Supprimer un groupe sanguin' })
    @ApiParam({ name: 'id', type: Number })
    async delete(@Param('id', ParseIntPipe) id: number) {
        return this.bloodGroupService.deleteBloodGroup(id);
    }
}
