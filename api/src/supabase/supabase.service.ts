import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private client!: SupabaseClient<Database>;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const url = this.config.getOrThrow<string>('SUPABASE_URL');
    const key = this.config.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY');
    this.client = createClient<Database>(url, key);
  }

  getClient(): SupabaseClient<Database> {
    return this.client;
  }
}
