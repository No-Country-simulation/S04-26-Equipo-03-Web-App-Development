import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateTalentRegisterDto } from './dto/create-talent-register.dto';
import { UpdateTalentProfileDto } from './dto/update-talent-profile.dto';
import { UpdateTalentRoleSkillsDto } from './dto/update-talent-role-skills.dto';
import { SaveSkillRatingsDto } from './dto/save-skill-ratings.dto';
import { TalentService } from './talent.service';

@ApiTags('talent')
@Controller('talent')
export class TalentController {
  constructor(private readonly talentService: TalentService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary:
      'Crear perfil de talento (multipart, foto opcional) — Paso 1 onboarding',
    description:
      'Requiere token. Igual que POST /talent pero acepta foto de perfil.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['first_name', 'last_name'],
      properties: {
        first_name: { type: 'string' },
        last_name: { type: 'string' },
        location: { type: 'string' },
        availability: {
          type: 'string',
          enum: [
            'ACTIVE_JOB_SEARCH',
            'OPEN_TO_OFFERS',
            'NOT_LOOKING_ASSESSMENT_ONLY',
          ],
        },
        blocked_enterprise_ids: {
          type: 'string',
          description: 'JSON array de UUIDs de empresas a ocultar',
          example: '["uuid-1","uuid-2"]',
        },
        file: {
          type: 'string',
          format: 'binary',
          description: 'JPG/PNG perfil, máx. 2 MiB por defecto',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Perfil creado correctamente.',
  })
  registerMultipart(
    @Req() req: Request,
    @UploadedFile() file: unknown,
    @Body() dto: CreateTalentRegisterDto,
  ) {
    const userId = (req['user'] as { id: string }).id;
    return this.talentService.register(userId, file, dto);
  }

  @Get('profiles')
  @ApiOperation({
    summary: 'Listar todos los perfiles de talento',
    description:
      'Devuelve las filas de Talent_profile. Para perfil completo (usuario, roles, skills, blacklist) usá GET /talent/profile/:profileId.',
  })
  listProfiles() {
    return this.talentService.listProfiles();
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({
    summary: 'Obtener el perfil completo del talento autenticado',
    description:
      'Devuelve profile, user, roles, skills y blocked_enterprises del talento autenticado.',
  })
  getMyProfile(@Req() req: Request) {
    const userId = (req['user'] as { id: string }).id;
    return this.talentService.findMyProfile(userId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get('profile/:profileId')
  @ApiOperation({
    summary: 'Obtener perfil de talento (pasos Figma agregados en DB)',
  })
  getProfile(@Param('profileId', ParseUUIDPipe) profileId: string) {
    return this.talentService.findProfileById(profileId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch('profile/:profileId')
  @ApiOperation({
    summary:
      'Actualizar perfil (ubicación, disponibilidad, bio, portfolio link, experiencia, educación)',
  })
  updateProfile(
    @Req() req: Request,
    @Param('profileId', ParseUUIDPipe) profileId: string,
    @Body() dto: UpdateTalentProfileDto,
  ) {
    const userId = (req['user'] as { id: string }).id;
    return this.talentService.updateProfile(userId, profileId, dto);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch('profile/:profileId/role-skills')
  @UseInterceptors(FileInterceptor('cv'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Paso 2 Figma: rol principal + stack (mín. 3 skills por id)',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['role_name', 'skills'],
      properties: {
        role_name: { type: 'string', example: 'Product Designer' },
        skills: {
          type: 'string',
          description:
            'JSON array de skills con skill_id y self_rating opcional (1–10)',
          example:
            '[{"skill_id":"uuid-1","self_rating":8},{"skill_id":"uuid-2"},{"skill_id":"uuid-3"}]',
        },
        cv: {
          type: 'string',
          format: 'binary',
          description: 'PDF del CV (opcional, máx. 10 MiB)',
        },
      },
    },
  })
  updateRoleSkills(
    @Req() req: Request,
    @Param('profileId', ParseUUIDPipe) profileId: string,
    @UploadedFile() cv: unknown,
    @Body() body: Record<string, string>,
  ) {
    const userId = (req['user'] as { id: string }).id;
    const dto = new UpdateTalentRoleSkillsDto();
    dto.role_name = body.role_name;
    dto.skills = UpdateTalentRoleSkillsDto.deserializeSkills(
      body.skills ?? '[]',
    );
    if (dto.skills.length < 3) {
      throw new BadRequestException('Se requieren mínimo 3 skills');
    }
    return this.talentService.updateRoleAndSkills(userId, profileId, dto, cv);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch('profile/:profileId/portfolio/pdf')
  @UseInterceptors(FileInterceptor('portfolio'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Subir portfolio PDF (Figma, máx. 10 MiB)' })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['portfolio'],
      properties: {
        portfolio: { type: 'string', format: 'binary' },
      },
    },
  })
  uploadPortfolioPdf(
    @Param('profileId', ParseUUIDPipe) profileId: string,
    @UploadedFile() portfolio: unknown,
  ) {
    return this.talentService.uploadPortfolioPdf(profileId, portfolio);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete('profile/:profileId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Desactivar talento (User.active = false)' })
  deactivate(@Param('profileId', ParseUUIDPipe) profileId: string) {
    return this.talentService.deactivateProfile(profileId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Get(':profileId/skill-suggestions')
  @ApiOperation({
    summary: 'Sugerencias de skills via IA para pre-diagnóstico',
    description:
      'Devuelve 4-5 skills sugeridas por Gemini según el rol objetivo del talento, ' +
      'equilibrando tipos (TECH/SOFT/COGNITIVE) y excluyendo skills ya seleccionadas.',
  })
  getSkillSuggestions(
    @Param('profileId', ParseUUIDPipe) profileId: string,
    @Req() req: Request,
  ) {
    const userId = (req['user'] as { id: string }).id;
    return this.talentService.suggestSkills(userId, profileId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post(':profileId/skill-ratings')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Guardar auto-calificaciones de skills (pre-diagnóstico)',
    description:
      'Inserta o actualiza las Talent_skill con el self_rating elegido ' +
      '("no_lo_conozco" | "lo_uso" | "lo_domino").',
  })
  saveSkillRatings(
    @Param('profileId', ParseUUIDPipe) profileId: string,
    @Body() dto: SaveSkillRatingsDto,
    @Req() req: Request,
  ) {
    const userId = (req['user'] as { id: string }).id;
    return this.talentService.saveSkillRatings(userId, profileId, dto);
  }
}
