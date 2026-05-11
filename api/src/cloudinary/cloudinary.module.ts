import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary';
import { parsePositiveInt } from './cloudinary.config';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: (): { limits: { fileSize: number } } => ({
        limits: {
          fileSize: parsePositiveInt(
            process.env.CLOUDINARY_MAX_FILE_BYTES,
            5 * 1024 * 1024,
          ),
        },
      }),
    }),
  ],
  controllers: [CloudinaryController],
  providers: [CloudinaryService, CloudinaryProvider],
  exports: [CloudinaryService, CloudinaryProvider],
})
export class CloudinaryModule {}
