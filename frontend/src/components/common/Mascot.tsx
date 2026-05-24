import { cn } from '@/lib/utils';

/**
 * Variantes de la mascota:
 * - idle       → personaje base, expresión neutra con sonrisa (Group-1)
 * - happy      → sonrisa grande, celebración (Group-4)
 * - searching  → con lupa, diagnóstico / análisis (Group-2)
 * - briefcase  → con maletín, perfil / portafolio (Group-3)
 * - backpack   → con mochila en el torso, aprendizaje (Group)
 * - ready      → mochila integrada, listo para empezar (Group-5)
 */
export type MascotVariant =
  | 'idle'
  | 'happy'
  | 'searching'
  | 'briefcase'
  | 'backpack'
  | 'ready';

const VARIANT_MAP: Record<MascotVariant, { src: string; alt: string; }> = {
  idle: { src: '/Group-1.svg', alt: 'Mascota TalentBridge' },
  happy: { src: '/Group-4.svg', alt: 'Mascota celebrando' },
  searching: { src: '/Group-2.svg', alt: 'Mascota analizando' },
  briefcase: { src: '/Group-3.svg', alt: 'Mascota con maletín' },
  backpack: { src: '/Group.svg', alt: 'Mascota con mochila' },
  ready: { src: '/Group-5.svg', alt: 'Mascota lista' },
};

interface MascotProps {
  variant?: MascotVariant;
  /** Clases del elemento img — usá esto para controlar tamaño: "w-[120px] h-[120px]", "w-full", etc. */
  className?: string;
  /** Sobreescribe el alt por defecto */
  alt?: string;
}

/**
 * Mascota ilustrada de TalentBridge.
 *
 * El tamaño lo define el padre. Ejemplos:
 *   <Mascot variant="happy" className="w-[160px]" />
 *   <Mascot variant="searching" className="w-full max-w-[200px]" />
 */
export function Mascot({ variant = 'idle', className, alt }: MascotProps) {
  const { src, alt: defaultAlt } = VARIANT_MAP[variant];

  return (
    <img
      src={ src }
      alt={ alt ?? defaultAlt }
      className={ cn('object-contain select-none', className) }
      draggable={ false }
    />
  );
}
