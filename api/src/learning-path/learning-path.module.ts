import { Module } from '@nestjs/common';
import { SupabaseModule } from '../supabase/supabase.module';
import { LearningPathController } from './learning-path.controller';
import { LearningPathService } from './learning-path.service';

@Module({
  imports: [SupabaseModule],
  controllers: [LearningPathController],
  providers: [LearningPathService],
  exports: [LearningPathService],
})
export class LearningPathModule {}
