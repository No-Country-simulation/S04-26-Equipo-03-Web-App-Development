import { Injectable } from '@nestjs/common';
import { SupabaseService } from './supabase/supabase.service';

@Injectable()
export class AppService {
  constructor(private readonly supabase: SupabaseService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async checkSupabaseConnection(): Promise<{ ok: boolean; error?: string }> {
    const { error } = await this.supabase
      .getClient()
      .from('_test_connection')
      .select('*')
      .limit(1);
    // Cualquier error PGRST indica que Supabase respondió → conexión válida
    // Solo falla si no hubo respuesta (credenciales inválidas, URL incorrecta, etc.)
    if (!error || (error.code && error.code.startsWith('PGRST'))) {
      return { ok: true };
    }
    return { ok: false, error: error.message };
  }
}
