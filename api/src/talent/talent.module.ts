import { Module } from '@nestjs/common';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { TalentController } from './talent.controller';
import { TalentService } from './talent.service';

@Module({
  imports: [CloudinaryModule],
  controllers: [TalentController],
  providers: [TalentService],
})
export class TalentModule {}
