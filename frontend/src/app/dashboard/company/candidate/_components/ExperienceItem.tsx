import { Skeleton } from '@/components/ui/skeleton';

interface ExperienceItemProps {
  title: string;
  company: string;
  description?: string;
}

export default function ExperienceItem({ title, company, description }: ExperienceItemProps) {
  return (
    <div className="flex gap-3 pb-3 not-last:border-b">
      <Skeleton className="bg-[#E5E7EB] h-10 w-10 rounded-md shrink-0" />
      <div className="w-full">
        <h3 className="font-semibold text-[#1a1a2e] text-sm">{ title }</h3>
        <p className="text-xs text-gray-600">{ company }</p>
        { description && (
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">{ description }</p>
        ) }
      </div>
    </div>
  );
}
