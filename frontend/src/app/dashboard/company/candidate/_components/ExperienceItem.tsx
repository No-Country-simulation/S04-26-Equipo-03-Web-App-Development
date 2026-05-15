import { Skeleton } from '@/components/ui/skeleton';

interface ExperienceItemProps {
  title: string;
  company: string;
}

export default function ExperienceItem({ title, company }: ExperienceItemProps) {
  return (
    <div className="flex gap-3 pb-3 not-last:border-b">
      <Skeleton className="bg-[#E5E7EB] h-10 w-10 rounded-md" />
      <div className="w-full">
        <h3 className="font-semibold text-[#1a1a2e] text-sm">{title}</h3>
        <p className="text-xs text-gray-600">{company}</p>
        <div className="space-y-2 mt-4">
          <Skeleton className="bg-[#E5E7EB] h-3 w-full rounded-full" />
          <Skeleton className="bg-[#E5E7EB] h-3 w-10/12 rounded-full" />
        </div>
      </div>
    </div>
  );
}
