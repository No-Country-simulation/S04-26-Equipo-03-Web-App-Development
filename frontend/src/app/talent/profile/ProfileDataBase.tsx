'use client';

import { useState } from 'react';
import SkillBadge from '@/components/common/SkillBadge';
import { Button } from '@/components/ui/button';
import RatingDisplay from './RatingDisplay';
import ProfileEditModal from './ProfileEditModal';
import { Eye } from 'lucide-react';
import Image from 'next/image';

const AVAILABILITY_LABEL: Record<string, string> = {
  ACTIVE_JOB_SEARCH: 'Búsqueda activa · Remoto',
  OPEN_TO_OFFERS: 'Abierto a ofertas · Remoto',
  NOT_LOOKING_ASSESSMENT_ONLY: 'No está buscando trabajo',
};

interface ProfileDataBaseProps {
  fullName: string;
  initials: string;
  roleName: string;
  location: string | null;
  availability: string | null;
  avatarUrl: string | null;
  bio: string | null;
  profileId: string;
}

const ProfileDataBase = ({
  fullName,
  initials,
  roleName,
  location,
  availability,
  avatarUrl,
  bio,
  profileId,
}: ProfileDataBaseProps) => {
  const [editOpen, setEditOpen] = useState(false);
  const availabilityLabel = availability ? (AVAILABILITY_LABEL[availability] ?? availability) : null;
  const subtitle = [roleName, location].filter(Boolean).join(' · ');

  return (
    <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-3 sm:gap-0">
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-300 rounded flex items-center justify-center text-gray-600 font-bold shrink-0 overflow-hidden">
            { avatarUrl ? (
              <Image src={ avatarUrl } alt={ fullName } width={ 64 } height={ 64 } className="object-cover w-full h-full" />
            ) : (
              initials
            ) }
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              { fullName }
            </h1>
            { subtitle && (
              <p className="text-sm sm:text-base text-gray-600">{ subtitle }</p>
            ) }
            { availabilityLabel && (
              <div className="flex items-center gap-2 mt-2">
                <span className="w-2 h-2 bg-green-500 rounded-full shrink-0"></span>
                <span className="text-xs sm:text-sm text-green-500 font-semibold">
                  { availabilityLabel }
                </span>
              </div>
            ) }
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="text-xs sm:text-sm h-8 flex-1 sm:flex-none"
            onClick={ () => setEditOpen(true) }
          >
            Editar perfil
          </Button>
          <Button variant="outline" className="text-xs sm:text-sm h-8 flex-1 sm:flex-none">
            Ver como reclutador
          </Button>
        </div>
      </div>

      { roleName && (
        <div className="flex items-center gap-2 flex-wrap">
          <SkillBadge variant="level">{ roleName }</SkillBadge>
          <RatingDisplay stars={ 0 } />
        </div>
      ) }

      <p className="text-xs text-gray-500 mt-4 flex flex-col sm:flex-row justify-between gap-1 sm:gap-0">
        <span className="italic">
          Completá tu perfil para mejorar tu visibilidad ante reclutadores.
        </span>
        <span className="flex items-center gap-1 whitespace-nowrap">
          <span className="flex items-center gap-1 font-bold">
            <Eye className="w-3.5 h-3.5 shrink-0" />
          </span>
        </span>
      </p>

      <ProfileEditModal
        open={ editOpen }
        onClose={ () => setEditOpen(false) }
        profileId={ profileId }
        initial={ {
          bio: bio ?? '',
          location: location ?? '',
          availability: availability ?? '',
        } }
      />
    </div>
  );
};

export default ProfileDataBase;
