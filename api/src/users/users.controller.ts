import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Body,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // GET /users/me
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener el perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil del usuario autenticado.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @Get('me')
  getMe(@Req() req: Request) {
    return this.usersService.findMe(req['user'].id as string);
  }

  // GET /users
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida exitosamente.',
  })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // GET /users/:id
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario obtenido exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  // PATCH /users/:id
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar un usuario por ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente.',
  })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({
    status: 403,
    description: 'Sin permiso para modificar este usuario.',
  })
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request,
  ) {
    if (req['user'].id !== id && req['user'].user_metadata?.role !== 'ADMIN') {
      throw new ForbiddenException(
        'No tienes permiso para modificar este usuario',
      );
    }
    return this.usersService.update(id, updateUserDto);
  }

  // PATCH /users/:id/deactivate
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Desactivar un usuario por ID' })
  @ApiResponse({
    status: 200,
    description: 'Usuario desactivado exitosamente.',
  })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({
    status: 403,
    description: 'Sin permiso para desactivar este usuario.',
  })
  @Patch(':id/deactivate')
  deactivate(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    if (req['user'].id !== id && req['user'].user_metadata?.role !== 'ADMIN') {
      throw new ForbiddenException(
        'No tienes permiso para desactivar este usuario',
      );
    }
    return this.usersService.deactivate(id);
  }

  // DELETE /users/:id
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar completamente un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado exitosamente.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({
    status: 403,
    description: 'Sin permiso para eliminar este usuario.',
  })
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    if (req['user'].id !== id && req['user'].user_metadata?.role !== 'ADMIN') {
      throw new ForbiddenException(
        'No tienes permiso para eliminar este usuario',
      );
    }
    return this.usersService.remove(id);
  }
}
