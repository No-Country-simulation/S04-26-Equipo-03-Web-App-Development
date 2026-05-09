import { Button } from '@/components/ui/button';

interface AuthSubmitButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
}

export const AuthSubmitButton = ({ label, onClick, className }: AuthSubmitButtonProps) => {
  return (
    <div className={`w-full mb-[11.1px] ${className}`}>
      <Button
        onClick={onClick}
        className="bg-[#4f46e5] text-white text-[14px] font-medium font-['Inter'] h-[41.99px] pt-[14.49px] pb-[15.23px] px-[23.25px] rounded-[8px] w-full hover:bg-[#4338ca] transition-colors mt-[4px] shadow-none"
      >
        {label}
      </Button>
    </div>
  );
};
