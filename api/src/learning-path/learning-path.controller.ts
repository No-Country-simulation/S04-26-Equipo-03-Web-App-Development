import { Controller, Get, Param, Patch, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { LearningPathService } from './learning-path.service';

@UseGuards(AuthGuard)
@Controller('learning-path')
export class LearningPathController {
  constructor(private readonly learningPathService: LearningPathService) {}

  /** Rutas de aprendizaje del talento autenticado */
  @Get('me')
  findMe(@Req() req: Request) {
    const userId = (req['user'] as { id: string }).id;
    return this.learningPathService.findMe(userId);
  }

  /** Lista todas las rutas de aprendizaje de un talento con progreso */
  @Get('profile/:profileId')
  findByProfile(@Param('profileId') profileId: string) {
    return this.learningPathService.findByProfile(profileId);
  }

  /** Obtiene una ruta completa con sus pasos y progreso */
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.learningPathService.findById(id);
  }

  /** Marca un paso como completado y actualiza el status de la ruta */
  @Patch(':id/steps/:stepId/complete')
  completeStep(
    @Req() req: Request,
    @Param('id') id: string,
    @Param('stepId') stepId: string,
  ) {
    const userId = (req['user'] as { id: string }).id;
    return this.learningPathService.completeStep(userId, id, stepId);
  }

  /** Desmarca un paso completado y recalcula el status de la ruta */
  @Patch(':id/steps/:stepId/uncomplete')
  uncompleteStep(
    @Req() req: Request,
    @Param('id') id: string,
    @Param('stepId') stepId: string,
  ) {
    const userId = (req['user'] as { id: string }).id;
    return this.learningPathService.uncompleteStep(userId, id, stepId);
  }
}
