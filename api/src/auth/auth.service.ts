import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { LoginDto } from './dto/login.dto';
import { RegisterEnterpriseDto } from './dto/register-enterprise.dto';
import { RegisterTalentDto } from './dto/register-talent.dto';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async registerTalent(dto: RegisterTalentDto) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client.auth.signUp({
      email: dto.email,
      password: dto.password,
      options: {
        data: {
          first_name: dto.first_name,
          last_name: dto.last_name,
          role: 'TALENT',
          active: true,
        },
      },
    });

    if (error) throw new InternalServerErrorException(error.message);
    return {
      message: 'Talento registrado exitosamente',
      userId: data.user?.id,
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

    if (error) throw new InternalServerErrorException(error.message);

    // 2. Crear cuenta de empresa vinculada al usuario
    const { error: enterpriseError } = await client
      .from('Account_Enterprise')
      .insert({
        owner_id: data.user?.id,
        name: dto.company_name,
        website_url: dto.website_url ?? null,
        description: dto.description ?? null,
        active: true,
      });

    if (enterpriseError)
      throw new InternalServerErrorException(enterpriseError.message);

    return {
      message: 'Empresa registrada exitosamente',
      userId: data.user?.id,
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
    };
  }
}
