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
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { SkillsService } from './skills.service';

@ApiTags('skills')
@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todas las skills' })
  @ApiResponse({ status: 200, description: 'Lista de skills.' })
  findAll() {
    return this.skillsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una skill por ID' })
  @ApiResponse({ status: 200, description: 'Skill encontrada.' })
  @ApiResponse({ status: 404, description: 'Skill no encontrada.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.skillsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva skill' })
  @ApiResponse({ status: 201, description: 'Skill creada.' })
  create(@Body() dto: CreateSkillDto) {
    return this.skillsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una skill' })
  @ApiResponse({ status: 200, description: 'Skill actualizada.' })
  @ApiResponse({ status: 404, description: 'Skill no encontrada.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateSkillDto) {
    return this.skillsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una skill' })
  @ApiResponse({ status: 204, description: 'Skill eliminada.' })
  @ApiResponse({ status: 404, description: 'Skill no encontrada.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.skillsService.remove(id);
  }
}
