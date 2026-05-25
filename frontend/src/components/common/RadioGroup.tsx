interface RadioGroupProps {
  options: { label: string; value: string; }[];
  name: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}
export default function RadioGroup({
  options,
  name,
  defaultValue,
  value,
  onChange,
}: RadioGroupProps) {
  return (
    <div className="space-y-2">
      { options.map((opt) => (
        <label
          key={ opt.value }
          className="flex items-center gap-2 text-sm text-[#1a1a2e] cursor-pointer"
        >
          <input
            type="radio"
            name={ name }
            checked={ value !== undefined ? value === opt.value : undefined }
            defaultChecked={ value === undefined ? opt.value === defaultValue : undefined }
            onChange={ () => onChange?.(opt.value) }
            className="accent-[#4F46E5]"
          />
          { opt.label }
        </label>
      )) }
    </div>
  );
}
