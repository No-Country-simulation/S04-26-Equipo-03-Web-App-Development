import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { RealtimeClientOptions } from '@supabase/realtime-js';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import WebSocket from 'ws';
import { Database } from '../types/database.types';

type RealtimeTransport = NonNullable<RealtimeClientOptions['transport']>;

@Injectable()
export class SupabaseService implements OnModuleInit {
  private client!: SupabaseClient<Database>;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const url = this.config.getOrThrow<string>('SUPABASE_URL');
    const key = this.config.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY');
    this.client = createClient<Database>(url, key, {
      realtime: {
        transport: WebSocket as unknown as RealtimeTransport,
      },
    });
  }

  getClient(): SupabaseClient<Database> {
    return this.client;
  }
}
