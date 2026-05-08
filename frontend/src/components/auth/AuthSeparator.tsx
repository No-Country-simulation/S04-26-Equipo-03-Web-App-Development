interface AuthSeparatorProps {
  label?: string;
}

export const AuthSeparator = ({ label = 'o' }: AuthSeparatorProps) => {
  return (
    <div className="flex gap-[10px] items-center pt-[6.89px] w-full">
      <div className="bg-[#e5e7eb] flex-1 h-px" />
      <span className="text-[#9ca3af] text-[11px] font-normal font-['Inter'] leading-[16.5px] tracking-[0.88px] uppercase">
        {label}
      </span>
      <div className="bg-[#e5e7eb] flex-1 h-px" />
    </div>
  );
};
