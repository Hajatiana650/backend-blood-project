import {
	Body,
	Controller,
	Get,
	Logger,
	Param,
	ParseIntPipe,
	Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnalysisService } from './analysis.service';
import { CreateAnalysisDto } from './dto/create-analysis.dto';

@ApiTags('analyses')
@Controller('analyses')
export class AnalysisController {
	private readonly logger = new Logger(AnalysisController.name);

	constructor(private readonly analysisService: AnalysisService) {}

	@Get()
	@ApiOperation({ summary: 'Lister toutes les analyses' })
	@ApiResponse({ status: 200, description: 'Liste des analyses' })
	async findAll() {
		this.logger.log('Fetching analyses');
		return this.analysisService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Récupérer une analyse par identifiant' })
	@ApiParam({ name: 'id', type: Number })
	async findOne(@Param('id', ParseIntPipe) id: number) {
		return this.analysisService.findOne(id);
	}

	@Post()
	@ApiOperation({ summary: 'Créer une analyse' })
	@ApiBody({ type: CreateAnalysisDto })
	async create(@Body() createAnalysisDto: CreateAnalysisDto) {
		return this.analysisService.create(createAnalysisDto);
	}
}
