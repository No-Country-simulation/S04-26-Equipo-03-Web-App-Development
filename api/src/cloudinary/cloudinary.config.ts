/** Shared env parsing for Cloudinary upload limits (Multer + service validation). */
export function parsePositiveInt(
  raw: string | undefined,
  fallback: number,
): number {
  if (raw === undefined || raw === '') {
    return fallback;
  }
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

export function isTruthyEnv(
  raw: string | undefined,
  defaultTrue: boolean,
): boolean {
  if (raw === undefined || raw === '') {
    return defaultTrue;
  }
  const v = raw.toLowerCase();
  if (v === '0' || v === 'false' || v === 'no' || v === 'off') {
    return false;
  }
  if (v === '1' || v === 'true' || v === 'yes' || v === 'on') {
    return true;
  }
  return defaultTrue;
}
