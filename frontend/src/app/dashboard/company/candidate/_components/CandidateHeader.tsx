import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SkillBadge from '@/components/common/SkillBadge';

export interface CandidateData {
  name: string;
  initials: string;
  avatarUrl?: string | null;
  role: string;
  location: string;
  status: string;
  experience: string;
}

interface CandidateHeaderProps {
  candidate: CandidateData;
}

export default function CandidateHeader({
  candidate,
}: CandidateHeaderProps) {
  const { name, initials, avatarUrl, role, location, status, experience } =
    candidate;
  return (
    <Card className="p-6 border-gray-200">
      <div className="flex items-start gap-4">
        <Avatar className="w-16 h-16">
          { avatarUrl && <AvatarImage src={ avatarUrl } alt={ name } /> }
          <AvatarFallback className="bg-gray-300 text-[#1a1a2e] font-bold text-lg">
            { initials }
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#1a1a2e]">{ name }</h1>
          { (role || location) && (
            <p className="text-sm text-gray-600">
              { [role, location].filter(Boolean).join(' · ') }
            </p>
          ) }
          { status && (
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-sm text-gray-600">{ status }</span>
            </div>
          ) }
          { experience && (
            <div className="flex items-center gap-2 mt-3">
              <Badge className="bg-[#F3F4F6] text-xs text-[#6B7280] border border-[#E5E7EB] rounded-full">
                { experience }
              </Badge>
            </div>
          ) }
        </div>
      </div>
    </Card>
  );
}
