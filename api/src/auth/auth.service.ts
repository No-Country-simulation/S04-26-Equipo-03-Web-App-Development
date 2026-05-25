import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { throwFromAuthSignUpError } from '../common/map-supabase-auth-error';
import { SupabaseService } from '../supabase/supabase.service';
import { LoginDto } from './dto/login.dto';
import { RegisterEnterpriseDto } from './dto/register-enterprise.dto';
import { RegisterTalentDto } from './dto/register-talent.dto';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async registerTalent(dto: RegisterTalentDto) {
    const client = this.supabaseService.getClient();

    // 1. Crear cuenta en auth
    const { error: signError } = await client.auth.signUp({
      email: dto.email,
      password: dto.password,
      options: {
        data: {
          role: 'TALENT',
          active: true,
        },
      },
    });

    if (signError) throwFromAuthSignUpError(signError);

    // 2. Auto-login para devolver el token al frontend
    const { data: loginData, error: loginError } =
      await client.auth.signInWithPassword({
        email: dto.email,
        password: dto.password,
      });

    if (loginError) throw new InternalServerErrorException(loginError.message);

    return {
      message: 'Cuenta creada exitosamente',
      user_metadata: loginData.user.user_metadata,
      access_token: loginData.session.access_token,
    };
  }

  async registerEnterprise(dto: RegisterEnterpriseDto) {
    const client = this.supabaseService.getClient();

    // 1. Crear usuario con rol RECRUITER
    const { error } = await client.auth.signUp({
      email: dto.email,
      password: dto.password,
      options: {
        data: {
          role: 'RECRUITER',
          active: true,
        },
      },
    });

    if (error) throwFromAuthSignUpError(error);

    // 2. Auto-login para devolver el token al frontend
    const { data: loginData, error: loginError } =
      await client.auth.signInWithPassword({
        email: dto.email,
        password: dto.password,
      });

    if (loginError) throw new InternalServerErrorException(loginError.message);

    return {
      message: 'Cuenta de empresa creada exitosamente',
      user_metadata: loginData.user.user_metadata,
      access_token: loginData.session.access_token,
    };
  }

  async login(loginDto: LoginDto) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client.auth.signInWithPassword({
      email: loginDto.email,
      password: loginDto.password,
    });

    if (error) throw new UnauthorizedException(error.message);

    return {
      user_metadata: data.user.user_metadata,
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_in: data.session.expires_in,
      expires_at: data.session.expires_at,
    };
  }

  async refresh(refreshToken: string) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      throw new UnauthorizedException(
        'Sesión expirada. Iniciá sesión nuevamente.',
      );
    }

    return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    };
  }
}
