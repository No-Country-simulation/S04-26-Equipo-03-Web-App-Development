import Image from 'next/image';
import { cn } from '@/lib/utils';

import group1 from '../../../public/Group-1.svg';
import group2 from '../../../public/Group-2.svg';
import group3 from '../../../public/Group-3.svg';
import group4 from '../../../public/Group-4.svg';
import group5 from '../../../public/Group-5.svg';
import group from '../../../public/Group.svg';

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

const VARIANT_MAP: Record<MascotVariant, { src: typeof group1; alt: string; }> = {
  idle: { src: group1, alt: 'Mascota TalentBridge' },
  happy: { src: group4, alt: 'Mascota celebrando' },
  searching: { src: group2, alt: 'Mascota analizando' },
  briefcase: { src: group3, alt: 'Mascota con maletín' },
  backpack: { src: group, alt: 'Mascota con mochila' },
  ready: { src: group5, alt: 'Mascota lista' },
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
    <Image
      src={ src }
      alt={ alt ?? defaultAlt }
      unoptimized
      className={ cn('object-contain select-none', className) }
    />
  );
}
