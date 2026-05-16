import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { DiagnosticController } from './diagnostic.controller';
import { DiagnosticService } from './diagnostic.service';

@Module({
  imports: [SupabaseModule],
  controllers: [DiagnosticController],
  providers: [DiagnosticService],
  exports: [DiagnosticService],
})
export class DiagnosticModule {}
