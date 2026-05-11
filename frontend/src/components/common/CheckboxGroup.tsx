import { Checkbox } from '@/components/ui/checkbox';
interface CheckboxOption {
  label: string;
  value: string;
}
interface CheckboxGroupProps {
  options: CheckboxOption[];
  defaultSelected?: string[];
}
export default function CheckboxGroup({
  options,
  defaultSelected = [],
}: CheckboxGroupProps) {
  return (
      <div className="space-y-2">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="flex items-center gap-2 text-sm text-[#1a1a2e]"
          >
            <Checkbox
              className="data-[state=checked]:bg-[#4f46e5] data-[state=checked]:border-[#4f46e5]"
              defaultChecked={defaultSelected.includes(opt.value)}
            />
            {opt.label}
          </label>
        ))}
      </div>
  );
}