import { Input } from '@/components/ui/input';

interface AuthInputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AuthInputField = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
}: AuthInputFieldProps) => {
  return (
    <div className="flex flex-col gap-[5.99px] items-start w-full">
      <div className="pb-[0.865px] w-full">
        <label className="text-[#374151] text-[12px] font-medium font-['Inter'] leading-[18px]">
          {label}
        </label>
      </div>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="bg-white border-[#d1d5db] border-solid h-[41.99px] px-[13.25px] pt-[10.605px] pb-[11.25px] rounded-[8px] w-full text-[13px] leading-[19.5px] placeholder:text-[#6b7280] shadow-none"
      />
    </div>
  );
};
