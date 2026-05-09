import {
	Body,
	Controller,
	Delete,
	Get,
	Logger,
	Param,
	ParseIntPipe,
	Patch,
	Post,
} from '@nestjs/common';
import {
	ApiBody,
	ApiOperation,
	ApiParam,
	ApiResponse,
	ApiTags,
} from '@nestjs/swagger';
import { DonorService } from './donor.sercice';
import { CreateDonorDto } from './dto/create-donor.dto';
import { UpdateDonorDto } from './dto/update-donor.dto';

@ApiTags('donors')
@Controller('donors')
export class DonorController {
	private readonly logger = new Logger(DonorController.name);

	constructor(private readonly donorService: DonorService) {}

	@Get()
	@ApiOperation({ summary: 'Lister tous les donneurs' })
	@ApiResponse({ status: 200, description: 'Liste des donneurs' })
	async findAll() {
		this.logger.log('Fetching donors list');
		return this.donorService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Récupérer un donneur par identifiant' })
	@ApiParam({ name: 'id', type: Number })
	async findOne(@Param('id', ParseIntPipe) id: number) {
		return this.donorService.findOne(id);
	}

	@Get(':id/profile')
	@ApiOperation({ summary: 'Récupérer le profil complet du donneur' })
	@ApiParam({ name: 'id', type: Number })
	async profile(@Param('id', ParseIntPipe) id: number) {
		return this.donorService.getProfile(id);
	}

	@Get(':id/dashboard')
	@ApiOperation({ summary: 'Récupérer le tableau de bord du donneur' })
	@ApiParam({ name: 'id', type: Number })
	async dashboard(@Param('id', ParseIntPipe) id: number) {
		return this.donorService.getDashboard(id);
	}

	@Get(':id/analyses')
	@ApiOperation({ summary: 'Historique des analyses du donneur' })
	@ApiParam({ name: 'id', type: Number })
	async analyses(@Param('id', ParseIntPipe) id: number) {
		return this.donorService.getAnalyses(id);
	}

	@Get(':id/donations')
	@ApiOperation({ summary: 'Historique des dons du donneur' })
	@ApiParam({ name: 'id', type: Number })
	async donations(@Param('id', ParseIntPipe) id: number) {
		return this.donorService.getDonations(id);
	}

	@Get(':id/notifications')
	@ApiOperation({ summary: 'Notifications du donneur' })
	@ApiParam({ name: 'id', type: Number })
	async notifications(@Param('id', ParseIntPipe) id: number) {
		return this.donorService.getNotifications(id);
	}

	@Post()
	@ApiOperation({ summary: 'Créer un donneur' })
	@ApiBody({ type: CreateDonorDto })
	async create(@Body() createDonorDto: CreateDonorDto) {
		return this.donorService.create(createDonorDto);
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Mettre à jour un donneur' })
	@ApiParam({ name: 'id', type: Number })
	@ApiBody({ type: UpdateDonorDto })
	async update(
		@Param('id', ParseIntPipe) id: number,
		@Body() updateDonorDto: UpdateDonorDto,
	) {
		return this.donorService.update(id, updateDonorDto);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Supprimer un donneur' })
	@ApiParam({ name: 'id', type: Number })
	async remove(@Param('id', ParseIntPipe) id: number) {
		return this.donorService.remove(id);
	}
}
