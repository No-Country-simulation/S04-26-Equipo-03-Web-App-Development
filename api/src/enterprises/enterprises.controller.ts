import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { EnterprisesService } from './enterprises.service';
import { CreateEnterpriseOnboardingDto } from './dto/create-enterprise-onboarding.dto';
import { UpdateEnterpriseDto } from './dto/update-enterprise.dto';

@ApiTags('enterprises')
@Controller('enterprises')
export class EnterprisesController {
  constructor(private readonly enterprisesService: EnterprisesService) {}

  // POST /enterprises/onboarding
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Post('onboarding')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary:
      'Completar onboarding de empresa (crea la empresa y actualiza el perfil del recruiter)',
  })
  @ApiResponse({ status: 201, description: 'Onboarding completado.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  completeOnboarding(
    @Req() req: Request,
    @Body() dto: CreateEnterpriseOnboardingDto,
  ) {
    return this.enterprisesService.completeOnboarding(
      req['user'].id as string,
      dto,
    );
  }

  // GET /enterprises
  @ApiOperation({ summary: 'Obtener todas las empresas activas' })
  @ApiResponse({ status: 200, description: 'Lista de empresas.' })
  @Get()
  findAll() {
    return this.enterprisesService.findAll();
  }

  // GET /enterprises/me
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener la empresa del usuario autenticado (owner o miembro)',
  })
  @ApiResponse({ status: 200, description: 'Empresa del usuario autenticado.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({
    status: 404,
    description: 'No hay empresa asociada a este usuario.',
  })
  @Get('me')
  getMyEnterprise(@Req() req: Request) {
    return this.enterprisesService.findMyEnterprise(req['user'].id as string);
  }

  // GET /enterprises/:id
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener una empresa por ID' })
  @ApiResponse({ status: 200, description: 'Empresa obtenida exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada.' })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.enterprisesService.findOne(id);
  }

  // GET /enterprises/:id/members
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener los miembros reclutadores de una empresa' })
  @ApiResponse({ status: 200, description: 'Lista de miembros de la empresa.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Empresa no encontrada.' })
  @Get(':id/members')
  findMembers(@Param('id', ParseUUIDPipe) id: string) {
    return this.enterprisesService.findMembers(id);
  }

  // PATCH /enterprises/:id
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una empresa por ID' })
  @ApiResponse({
    status: 200,
    description: 'Empresa actualizada exitosamente.',
  })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({
    status: 403,
    description: 'Sin permiso para modificar esta empresa.',
  })
  @Patch(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEnterpriseDto,
    @Req() req: Request,
  ) {
    const enterprise = await this.enterprisesService.findOne(id);
    if (
      enterprise.owner_id !== req['user'].id &&
      req['user'].user_metadata?.role !== 'ADMIN'
    ) {
      throw new ForbiddenException(
        'No tienes permiso para modificar esta empresa',
      );
    }
    return this.enterprisesService.update(id, dto);
  }

  // PATCH /enterprises/:id/deactivate
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Desactivar una empresa por ID' })
  @ApiResponse({
    status: 200,
    description: 'Empresa desactivada exitosamente.',
  })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({
    status: 403,
    description: 'Sin permiso para desactivar esta empresa.',
  })
  @Patch(':id/deactivate')
  async deactivate(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ) {
    const enterprise = await this.enterprisesService.findOne(id);
    if (
      enterprise.owner_id !== req['user'].id &&
      req['user'].user_metadata?.role !== 'ADMIN'
    ) {
      throw new ForbiddenException(
        'No tienes permiso para desactivar esta empresa',
      );
    }
    return this.enterprisesService.deactivate(id);
  }

  // DELETE /enterprises/:id
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una empresa por ID' })
  @ApiResponse({ status: 200, description: 'Empresa eliminada exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({
    status: 403,
    description: 'Sin permiso para eliminar esta empresa.',
  })
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    const enterprise = await this.enterprisesService.findOne(id);
    if (
      enterprise.owner_id !== req['user'].id &&
      req['user'].user_metadata?.role !== 'ADMIN'
    ) {
      throw new ForbiddenException(
        'No tienes permiso para eliminar esta empresa',
      );
    }
    return this.enterprisesService.remove(id);
  }

  // GET /enterprises/recruiters/me/favorites
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener talentos favoritos del reclutador autenticado',
  })
  @ApiResponse({ status: 200, description: 'Lista de perfiles favoritos.' })
  @ApiResponse({ status: 404, description: 'El usuario no es reclutador.' })
  @Get('recruiters/me/favorites')
  getFavorites(@Req() req: Request) {
    return this.enterprisesService.getFavorites(req['user'].id as string);
  }

  // POST /enterprises/recruiters/me/favorites/:talentProfileId
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Agregar un talento a favoritos' })
  @ApiResponse({ status: 201, description: 'Talento agregado a favoritos.' })
  @ApiResponse({ status: 404, description: 'El usuario no es reclutador.' })
  @HttpCode(HttpStatus.CREATED)
  @Post('recruiters/me/favorites/:talentProfileId')
  addFavorite(
    @Req() req: Request,
    @Param('talentProfileId', ParseUUIDPipe) talentProfileId: string,
  ) {
    return this.enterprisesService.addFavorite(
      req['user'].id as string,
      talentProfileId,
    );
  }

  // DELETE /enterprises/recruiters/me/favorites/:talentProfileId
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar un talento de favoritos' })
  @ApiResponse({ status: 200, description: 'Talento eliminado de favoritos.' })
  @ApiResponse({ status: 404, description: 'El usuario no es reclutador.' })
  @HttpCode(HttpStatus.OK)
  @Delete('recruiters/me/favorites/:talentProfileId')
  removeFavorite(
    @Req() req: Request,
    @Param('talentProfileId', ParseUUIDPipe) talentProfileId: string,
  ) {
    return this.enterprisesService.removeFavorite(
      req['user'].id as string,
      talentProfileId,
    );
  }
}
