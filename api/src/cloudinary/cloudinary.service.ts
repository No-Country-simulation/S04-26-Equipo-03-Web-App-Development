import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Buffer } from 'node:buffer';
import { isTruthyEnv, parsePositiveInt } from './cloudinary.config';
import { Cloudinary } from './cloudinary';

export type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
};

/** Validated in-memory upload (avoids `Express.Multer.File` + type-aware ESLint gaps). */
export type MemoryUploadedFile = {
  buffer: Uint8Array;
  mimetype: string;
};

/** Shape of the `cloudinary` namespace used in this service (SDK is JS without full typings). */
type CloudinaryLib = {
  v2: {
    config: (options: {
      cloud_name: string;
      api_key: string;
      api_secret: string;
    }) => void;
    uploader: {
      upload: (
        dataUri: string,
        options: Record<string, unknown>,
        callback: (
          error: Error | undefined,
          result: CloudinaryUploadResult | undefined,
        ) => void,
      ) => void;
    };
  };
};

function configureCloudinarySdk(
  lib: CloudinaryLib,
  options: {
    cloud_name: string;
    api_key: string;
    api_secret: string;
  },
): void {
  lib.v2.config(options);
}

function uploadDataUriWithCloudinary(
  lib: CloudinaryLib,
  dataUri: string,
  options: Record<string, unknown>,
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    lib.v2.uploader.upload(dataUri, options, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      if (!result?.secure_url || !result?.public_id) {
        reject(new Error('Respuesta inválida de Cloudinary'));
        return;
      }
      resolve({
        secure_url: result.secure_url,
        public_id: result.public_id,
      });
    });
  });
}

function parseMemoryUploadedFile(raw: unknown): MemoryUploadedFile {
  if (raw === null || typeof raw !== 'object') {
    throw new BadRequestException('Archivo vacío o no recibido');
  }
  const rec = raw as Record<string, unknown>;
  const buffer = rec.buffer;
  const mimetype = rec.mimetype;
  if (!(buffer instanceof Uint8Array) || buffer.byteLength === 0) {
    throw new BadRequestException('Archivo vacío o no recibido');
  }
  if (typeof mimetype !== 'string' || mimetype.length === 0) {
    throw new BadRequestException('Tipo de archivo no válido');
  }
  return { buffer, mimetype };
}

export function isNonEmptyUploadedFile(raw: unknown): boolean {
  if (raw === null || raw === undefined || typeof raw !== 'object') {
    return false;
  }
  const rec = raw as Record<string, unknown>;
  const buffer = rec.buffer;
  return buffer instanceof Uint8Array && buffer.byteLength > 0;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function initialsFromNames(firstName: string, lastName: string): string {
  const a = firstName.trim()[0] ?? '?';
  const b = lastName.trim()[0] ?? '';
  return escapeXml(`${a}${b}`.toUpperCase().slice(0, 2));
}

function buildInitialsAvatarSvg(firstName: string, lastName: string): string {
  const initials = initialsFromNames(firstName, lastName);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#5b21b6"/>
  <text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="system-ui,Segoe UI,sans-serif" font-size="200" font-weight="700">${initials}</text>
</svg>`;
}

@Injectable()
export class CloudinaryService implements OnModuleInit {
  constructor(
    @Inject(Cloudinary)
    private readonly cloudinary: CloudinaryLib,
    private readonly config: ConfigService,
  ) {}

  onModuleInit() {
    configureCloudinarySdk(this.cloudinary, {
      cloud_name: this.config.getOrThrow<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.config.getOrThrow<string>('CLOUDINARY_API_KEY'),
      api_secret: this.config.getOrThrow<string>('CLOUDINARY_API_SECRET'),
    });
  }

  /** Accepts the object Multer provides; validated without relying on Multer's types. */
  upload(file: unknown): Promise<CloudinaryUploadResult> {
    const { buffer, mimetype } = parseMemoryUploadedFile(file);

    const maxBytes = parsePositiveInt(
      this.config.get<string>('CLOUDINARY_MAX_FILE_BYTES'),
      5 * 1024 * 1024,
    );
    if (buffer.byteLength > maxBytes) {
      throw new BadRequestException(
        `El archivo supera el máximo permitido (${maxBytes} bytes)`,
      );
    }

    const dataUri = `data:${mimetype};base64,${Buffer.from(buffer).toString('base64')}`;

    const options = this.buildUploadOptions(mimetype);

    return uploadDataUriWithCloudinary(this.cloudinary, dataUri, options);
  }

  /**
   * Foto de perfil (onboarding paso 1): imagen subida o avatar por defecto con iniciales (SVG → Cloudinary).
   * Carpeta sugerida: `{CLOUDINARY_FOLDER}/talent/avatars`.
   */
  async uploadTalentProfileAvatar(
    file: unknown,
    firstName: string,
    lastName: string,
  ): Promise<CloudinaryUploadResult> {
    const maxProfile = parsePositiveInt(
      this.config.get<string>('CLOUDINARY_PROFILE_MAX_FILE_BYTES'),
      2 * 1024 * 1024,
    );

    if (isNonEmptyUploadedFile(file)) {
      const { buffer, mimetype } = parseMemoryUploadedFile(file);
      if (buffer.byteLength > maxProfile) {
        throw new BadRequestException(
          `La foto de perfil supera el máximo permitido (${maxProfile} bytes, ~2 MiB en Figma)`,
        );
      }
      if (!mimetype.startsWith('image/')) {
        throw new BadRequestException(
          'La foto de perfil debe ser una imagen (JPG o PNG)',
        );
      }
      const dataUri = `data:${mimetype};base64,${Buffer.from(buffer).toString('base64')}`;
      const options = this.buildUploadOptions(mimetype, 'talent/avatars');
      return uploadDataUriWithCloudinary(this.cloudinary, dataUri, options);
    }

    const svg = buildInitialsAvatarSvg(firstName, lastName);
    const dataUri = `data:image/svg+xml;charset=utf-8;base64,${Buffer.from(svg, 'utf8').toString('base64')}`;
    const options = this.buildUploadOptions('image/svg+xml', 'talent/avatars');
    return uploadDataUriWithCloudinary(this.cloudinary, dataUri, options);
  }

  /**
   * Portfolio PDF (Figma): hasta 10 MiB, carpeta `talent/portfolios`.
   */
  async uploadTalentPortfolioPdf(
    file: unknown,
  ): Promise<CloudinaryUploadResult> {
    const { buffer, mimetype } = parseMemoryUploadedFile(file);
    const maxBytes = parsePositiveInt(
      this.config.get<string>('CLOUDINARY_PORTFOLIO_MAX_FILE_BYTES'),
      10 * 1024 * 1024,
    );
    if (buffer.byteLength > maxBytes) {
      throw new BadRequestException(
        `El PDF supera el máximo permitido (${maxBytes} bytes)`,
      );
    }
    if (mimetype !== 'application/pdf') {
      throw new BadRequestException('El portfolio debe ser un PDF');
    }
    const dataUri = `data:${mimetype};base64,${Buffer.from(buffer).toString('base64')}`;
    const options: Record<string, unknown> = {
      resource_type: 'raw',
      ...this.buildFolderOnlyOptions('talent/portfolios'),
    };
    return uploadDataUriWithCloudinary(this.cloudinary, dataUri, options);
  }

  private buildFolderOnlyOptions(subfolder: string): Record<string, unknown> {
    const root = this.config.get<string>('CLOUDINARY_FOLDER');
    const parts = [root, subfolder].filter(
      (p): p is string => typeof p === 'string' && p.length > 0,
    );
    return parts.length > 0 ? { folder: parts.join('/') } : {};
  }

  /**
   * Para imágenes: limita el lado mayor (crop limit) y aplica compresión/formato automáticos en Cloudinary.
   */
  private buildUploadOptions(
    mimetype: string,
    subfolder?: string,
  ): Record<string, unknown> {
    const options: Record<string, unknown> = { resource_type: 'auto' };
    const root = this.config.get<string>('CLOUDINARY_FOLDER');
    const parts = [root, subfolder].filter(
      (p): p is string => typeof p === 'string' && p.length > 0,
    );
    if (parts.length > 0) {
      options.folder = parts.join('/');
    }

    const optimize = isTruthyEnv(
      this.config.get<string>('CLOUDINARY_IMAGE_OPTIMIZE'),
      true,
    );
    if (
      optimize &&
      mimetype.startsWith('image/') &&
      !mimetype.includes('svg')
    ) {
      let edge = parsePositiveInt(
        this.config.get<string>('CLOUDINARY_IMAGE_MAX_EDGE_PX'),
        2048,
      );
      edge = Math.min(edge, 4096);

      options.transformation = [
        { width: edge, height: edge, crop: 'limit' },
        { quality: 'auto:good', fetch_format: 'auto' },
      ];
    }

    return options;
  }
}
