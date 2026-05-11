import { Input } from '@/components/ui/input';
import type { InputHTMLAttributes } from 'react';
interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}
export default function FormField({ label, hint, ...inputProps }: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1a1a2e] mb-2">
        {label}
      </label>
      <Input className="h-12 border-gray-200 rounded-md" {...inputProps} />
      {hint && <p className="text-sm text-gray-500 mt-2">{hint}</p>}
    </div>
  );
}