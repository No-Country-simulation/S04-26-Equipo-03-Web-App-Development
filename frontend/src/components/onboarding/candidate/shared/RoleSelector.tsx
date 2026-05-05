import { X, ChevronDown } from 'lucide-react';

interface RoleSelectorProps {
  role: string;
  onRoleChange: (role: string) => void;
}

export const RoleSelector = ({ role, onRoleChange }: RoleSelectorProps) => {
  return (
    <div className="flex flex-col gap-[15.115px] w-full">
      <div className="flex flex-col gap-[6px]">
        <label className="text-[#374151] text-[12px] font-medium font-['Inter'] leading-[18px]">
          Rol principal <span className="text-[#ef4444]">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder='Empezá a escribir, ej: "product des…"'
            className="bg-white border-[#d1d5db] h-[43.98px] px-[12px] rounded-[8px] w-full text-[14px] leading-[21px] placeholder:text-[#6b7280] outline-none border-solid focus:border-[#4f46e5]"
            value={role}
            onChange={(e) => onRoleChange(e.target.value)}
          />
          <ChevronDown className="absolute right-[12px] top-[13px] size-[18px] text-[#6b7280]" />
        </div>
        <p className="text-[#111827] text-[14px] font-normal font-['Inter'] leading-[21px]">
          Un solo rol. Este es el rol sobre el que vas a ser evaluada.
        </p>
      </div>

      {role && (
        <div className="bg-[#eef2ff] border border-[#c7d2fe] px-[11.25px] py-[6.25px] rounded-full self-start flex items-center gap-[6px]">
          <span className="text-[#4f46e5] text-[12px] font-normal font-['Inter'] leading-[18px]">
            {role}
          </span>
          <button onClick={() => onRoleChange('')} className="text-[#6b7280] hover:text-[#4f46e5]">
            <X className="size-[11px]" />
          </button>
        </div>
      )}
    </div>
  );
};
