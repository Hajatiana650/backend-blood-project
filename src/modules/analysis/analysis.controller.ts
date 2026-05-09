import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnalysisService } from './analysis.service';
import { CreateAnalysisDto } from './dto/create-analysis.dto';

@ApiTags('analysis')
@Controller('analysis')
export class AnalysisController {
	constructor(private readonly analysisService: AnalysisService) {}

	@Get()
	@ApiOperation({ summary: 'Lister toutes les analyses' })
	@ApiResponse({ status: 200, description: 'Liste des analyses' })
	findAll() {
		return this.analysisService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Récupérer une analyse par identifiant' })
	@ApiParam({ name: 'id', type: Number })
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.analysisService.findOne(id);
	}

	@Post()
	@ApiOperation({ summary: 'Créer une analyse et mettre à jour automatiquement isApte' })
	@ApiBody({ type: CreateAnalysisDto })
	@ApiResponse({
		status: 201,
		description: 'Analyse créée avec mise à jour du statut du donneur',
	})
	create(@Body() createAnalysisDto: CreateAnalysisDto) {
		return this.analysisService.create(createAnalysisDto);
	}
}
