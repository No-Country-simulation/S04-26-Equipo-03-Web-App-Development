import {
  Bell,
  Eye,
  Star,
  Mail,
  ChessRook,
  Check,
  Clock,
  MessageSquare,
  Shield,
} from 'lucide-react';

export const notifications = [
  {
    id: 1,
    icon: Eye,
    title: 'Una empresa estuvo revisando tu perfil',
    description:
      'Mantené tu perfil al día — los reclutadores vuelven a perfiles activos.',
    time: 'hace 2 h',
    read: false,
  },
  {
    id: 2,
    icon: Star,
    title: 'Una empresa marcó tu perfil como interesante',
    description: 'Tu perfil quedó en la shortlist de una búsqueda activa.',
    time: 'hace 5 h',
    read: false,
  },
  {
    id: 3,
    icon: Mail,
    title: 'Una empresa te contactó por email',
    description: 'Acme Studio te escribió a tu casilla. Revisá la bandeja.',
    time: 'ayer',
    read: false,
  },
  {
    id: 4,
    icon: ChessRook,
    title: 'Completaste un hito de tu ruta',
    description:
      'Cerraste "Diseño accesible" — desbloquéate el siguiente bloque.',
    time: 'hace 1 día',
    read: true,
  },
  {
    id: 5,
    icon: Check,
    title: 'Completaste un recurso',
    description:
      'Marcaste "Color contrast" como hecho. Quedan 2 para cerrar este hito.',
    time: 'hace 2 días',
    read: true,
  },
  {
    id: 6,
    icon: Clock,
    title: 'Tu diagnóstico está disponible para retomar',
    description:
      'Pasaron 30 días desde tu último diagnóstico — un buen momento para volverte a medirte.',
    time: 'hace 3 días',
    read: true,
  },
  {
    id: 7,
    icon: Bell,
    title: 'Tu perfil está al 70%',
    description: 'Completado para que más empresas te encuentren.',
    time: 'hace 5 días',
    read: true,
  },
  {
    id: 8,
    icon: MessageSquare,
    title: 'Recibiste una nueva reseña en tu perfil',
    description:
      'Marina G. (compañera de trabajo) dejó una reseña sobre tu trabajo.',
    time: 'hace 1 semana',
    read: true,
  },
  {
    id: 9,
    icon: Shield,
    title: 'Una reseña que denunciaste fue resuelta',
    description:
      'El equipo revisó la denuncia y tomó acción. Ya podés ver el resultado.',
    time: 'hace 2 semanas',
    read: true,
  },
];
