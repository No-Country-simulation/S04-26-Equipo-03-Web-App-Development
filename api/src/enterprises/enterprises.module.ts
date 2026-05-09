import { Module } from '@nestjs/common';
import { EnterprisesService } from './enterprises.service';
import { EnterprisesController } from './enterprises.controller';

@Module({
  controllers: [EnterprisesController],
  providers: [EnterprisesService],
})
export class EnterprisesModule {}
