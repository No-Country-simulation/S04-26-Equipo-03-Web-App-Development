import {
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
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTalentRegisterDto } from './dto/create-talent-register.dto';
import { UpdateTalentProfileDto } from './dto/update-talent-profile.dto';
import { UpdateTalentRoleSkillsDto } from './dto/update-talent-role-skills.dto';
import { TalentService } from './talent.service';

@ApiTags('talent')
@Controller('talent')
export class TalentController {
  constructor(private readonly talentService: TalentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar talento (JSON, sin foto)',
    description:
      'Misma lógica que POST /talent/register pero sin multipart. Foto: avatar por iniciales en Cloudinary.',
  })
  @ApiResponse({
    status: 201,
    description:
      'Creado: { message }; opcional persistence_notes si availability/avatar_url no pudieron persistirse (falta migración). Tokens vía login.',
  })
  registerJson(@Body() dto: CreateTalentRegisterDto) {
    return this.talentService.registerJson(dto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Registrar talento (multipart, archivo opcional paso 1 Figma)',
    description:
      'Campos texto + archivo opcional `file` (mismo nombre que en el cliente / Cloudinary). Si no hay archivo, se sube avatar SVG con iniciales.',
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['email', 'password', 'first_name', 'last_name'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
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
    description: 'Creado: ver POST /talent.',
  })
  registerMultipart(
    @UploadedFile() file: unknown,
    @Body() dto: CreateTalentRegisterDto,
  ) {
    return this.talentService.register(file, dto);
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

  @Get('profile/:profileId')
  @ApiOperation({
    summary: 'Obtener perfil de talento (pasos Figma agregados en DB)',
  })
  getProfile(@Param('profileId', ParseUUIDPipe) profileId: string) {
    return this.talentService.findProfileById(profileId);
  }

  @Patch('profile/:profileId')
  @ApiOperation({
    summary:
      'Actualizar perfil (ubicación, disponibilidad, bio, portfolio link, experiencia, educación)',
  })
  updateProfile(
    @Param('profileId', ParseUUIDPipe) profileId: string,
    @Body() dto: UpdateTalentProfileDto,
  ) {
    return this.talentService.updateProfile(profileId, dto);
  }

  @Patch('profile/:profileId/role-skills')
  @ApiOperation({
    summary: 'Paso 2 Figma: rol principal + stack (mín. 3 skills por id)',
  })
  updateRoleSkills(
    @Param('profileId', ParseUUIDPipe) profileId: string,
    @Body() dto: UpdateTalentRoleSkillsDto,
  ) {
    return this.talentService.updateRoleAndSkills(profileId, dto);
  }

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

  @Delete('profile/:profileId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Desactivar talento (User.active = false)' })
  deactivate(@Param('profileId', ParseUUIDPipe) profileId: string) {
    return this.talentService.deactivateProfile(profileId);
  }
}
