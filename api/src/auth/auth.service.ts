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
    const { data, error } = await client.auth.signUp({
      email: dto.email,
      password: dto.password,
      options: {
        data: {
          first_name: dto.first_name,
          last_name: dto.last_name,
          role: 'RECRUITER',
          active: true,
        },
      },
    });

    if (error) throwFromAuthSignUpError(error);

    const userId = data.user?.id;

    // 2. Crear cuenta de empresa vinculada al usuario
    const { data: enterpriseData, error: enterpriseError } = await client
      .from('Account_Enterprise')
      .insert({
        owner_id: userId,
        name: dto.company_name,
        website_url: dto.website_url ?? null,
        description: dto.description ?? null,
        active: true,
      })
      .select('id')
      .single();

    if (enterpriseError)
      throw new InternalServerErrorException(enterpriseError.message);

    // 3. Agregar al owner como miembro en Recruiter_enterprise
    const { error: recruiterError } = await client
      .from('Recruiter_enterprise')
      .insert({
        user_id: userId,
        enterprise_id: enterpriseData.id,
        active: true,
      });

    if (recruiterError)
      throw new InternalServerErrorException(recruiterError.message);

    return {
      message: 'Empresa registrada exitosamente',
      userId,
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
