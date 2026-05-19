import { Input } from '@/components/ui/input';

interface AuthInputFieldProps {
  label: string;
  name?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export const AuthInputField = ({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  defaultValue,
  onChange,
  error,
}: AuthInputFieldProps) => {
  return (
    <div className="flex flex-col gap-[5.99px] items-start w-full">
      <div className="pb-[0.865px] w-full">
        <label className="text-[#374151] text-[12px] font-medium font-['Inter'] leading-[18px]">
          { label }
        </label>
      </div>
      <Input
        name={ name }
        type={ type }
        placeholder={ placeholder }
        value={ value }
        defaultValue={ defaultValue }
        onChange={ onChange }
        className={ `bg-white border-solid h-[41.99px] px-[13.25px] pt-[10.605px] pb-[11.25px] rounded-[8px] w-full text-[13px] leading-[19.5px] placeholder:text-[#6b7280] shadow-none ${error ? 'border-[#ef4444] focus-visible:ring-0' : 'border-[#d1d5db]'
          }` }
      />
      { error && (
        <p className="text-[11px] text-[#ef4444] font-['Inter'] leading-[16px]">{ error }</p>
      ) }
    </div>
  );
};
