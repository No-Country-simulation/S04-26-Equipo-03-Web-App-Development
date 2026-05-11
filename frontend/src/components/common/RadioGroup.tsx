interface RadioGroupProps {
  options: { label: string; value: string }[];
  name: string;
  defaultValue?: string;
}
export default function RadioGroup({
  options,
  name,
  defaultValue,
}: RadioGroupProps) {
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex items-center gap-2 text-sm text-[#1a1a2e]"
        >
          <input
            type="radio"
            name={name}
            defaultChecked={opt.value === defaultValue}
            className="accent-[#4F46E5]"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}
