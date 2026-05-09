import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterEnterpriseDto } from './dto/register-enterprise.dto';
import { RegisterTalentDto } from './dto/register-talent.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/talent')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registro de talento' })
  @ApiResponse({ status: 201, description: 'Talento registrado exitosamente.' })
  registerTalent(@Body() dto: RegisterTalentDto) {
    return this.authService.registerTalent(dto);
  }

  @Post('register/enterprise')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registro de empresa' })
  @ApiResponse({ status: 201, description: 'Empresa registrada exitosamente.' })
  registerEnterprise(@Body() dto: RegisterEnterpriseDto) {
    return this.authService.registerEnterprise(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso, retorna tokens de sesión.',
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);

    res.cookie('access_token', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000, // 1 hora
    });

    return result;
  }
}
