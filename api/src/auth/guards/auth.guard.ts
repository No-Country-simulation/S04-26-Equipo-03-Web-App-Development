import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token =
      (request.cookies as Record<string, string>)?.access_token ??
      request.headers.authorization?.replace('Bearer ', '');

    if (!token) throw new UnauthorizedException('Token no proporcionado');

    const client = this.supabaseService.getClient();
    const { data, error } = await client.auth.getUser(token);

    if (error || !data.user) throw new UnauthorizedException('Token inválido');

    request['user'] = data.user;
    return true;
  }
}
