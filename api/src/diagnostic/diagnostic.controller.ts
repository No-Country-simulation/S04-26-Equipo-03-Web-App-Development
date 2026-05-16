import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { DiagnosticService } from './diagnostic.service';
import { CreateDiagnosticDto } from './dto/create-diagnostic.dto';
import { SubmitResponsesDto } from './dto/submit-responses.dto';

@ApiTags('diagnostic')
@Controller('diagnostic')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class DiagnosticController {
  constructor(private readonly diagnosticService: DiagnosticService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Generar cuestionario de diagnóstico con IA (Gemini)',
    description:
      'Crea un diagnóstico en estado PENDING y genera preguntas personalizadas según el rol y skills del talento.',
  })
  @ApiResponse({ status: 201, description: 'Cuestionario generado.' })
  @ApiResponse({
    status: 400,
    description: 'Talento sin rol o skills asignadas.',
  })
  create(@Body() dto: CreateDiagnosticDto) {
    return this.diagnosticService.create(dto);
  }

  @Post(':diagnosticId/responses')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Enviar respuestas del diagnóstico inicial (INITIAL_ONBOARDING)',
    description:
      'Recibe las respuestas, genera el gap analysis con Gemini, actualiza scores en Talent_skill, marca el diagnóstico como COMPLETED y crea la ruta de aprendizaje.',
  })
  @ApiResponse({
    status: 200,
    description: 'Análisis generado y ruta de aprendizaje creada.',
  })
  @ApiResponse({
    status: 400,
    description:
      'Diagnóstico ya completado, tipo incorrecto o respuestas insuficientes.',
  })
  submitOnboardingResponses(
    @Param('diagnosticId', ParseUUIDPipe) diagnosticId: string,
    @Body() dto: SubmitResponsesDto,
  ) {
    return this.diagnosticService.submitOnboardingResponses(diagnosticId, dto);
  }

  @Post(':diagnosticId/skill-responses')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Enviar respuestas del diagnóstico de validación de skills (SKILL_VALIDATION)',
    description:
      'Recibe las respuestas, genera el gap analysis con Gemini y actualiza el estado de validación de cada skill. No genera ruta de aprendizaje.',
  })
  @ApiResponse({ status: 200, description: 'Análisis de validación generado.' })
  @ApiResponse({
    status: 400,
    description:
      'Diagnóstico ya completado, tipo incorrecto o respuestas insuficientes.',
  })
  submitSkillValidationResponses(
    @Param('diagnosticId', ParseUUIDPipe) diagnosticId: string,
    @Body() dto: SubmitResponsesDto,
  ) {
    return this.diagnosticService.submitSkillValidationResponses(
      diagnosticId,
      dto,
    );
  }

  @Get(':diagnosticId')
  @ApiOperation({ summary: 'Obtener un diagnóstico por ID' })
  @ApiResponse({ status: 200, description: 'Diagnóstico encontrado.' })
  findById(@Param('diagnosticId', ParseUUIDPipe) diagnosticId: string) {
    return this.diagnosticService.findById(diagnosticId);
  }

  @Get('profile/:profileId')
  @ApiOperation({
    summary: 'Listar todos los diagnósticos de un perfil de talento',
  })
  findByProfile(@Param('profileId', ParseUUIDPipe) profileId: string) {
    return this.diagnosticService.findByProfile(profileId);
  }
}
