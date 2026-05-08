import { Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface DateInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showIcon?: boolean;
  className?: string;
}

export const DateInput = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  showIcon = true,
  className,
}: DateInputProps) => {
  return (
    <div className="flex flex-col gap-[5.99px] items-start w-full">
      <div className="pb-[0.865px] w-full">
        <label className="text-[#374151] text-[12px] font-medium font-['Inter'] leading-[18px]">
          {label}
        </label>
      </div>
      <div className="relative w-full group">
        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={cn(
            "bg-white border-[#d1d5db] border-solid h-[41.99px] px-[13.25px] pt-[10.605px] pb-[11.25px] rounded-[8px] w-full text-[13px] leading-[19.5px] font-['Inter'] text-[#111827] placeholder:text-[#6b7280] shadow-none",
            "relative",
            showIcon && "pr-[38px]",
            "[&::-webkit-datetime-edit]:p-0",
            "[&::-webkit-datetime-edit-fields-wrapper]:p-0",
            !value && "[&::-webkit-datetime-edit]:text-[#6b7280]",
            "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            "[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer",
            className
          )}
        />
        {showIcon && (
          <Calendar 
            className="absolute right-[13.25px] top-1/2 -translate-y-1/2 size-[16px] text-[#6b7280] pointer-events-none group-focus-within:text-[#4f46e5] transition-colors" 
            strokeWidth={2}
          />
        )}
      </div>
    </div>
  );
};
