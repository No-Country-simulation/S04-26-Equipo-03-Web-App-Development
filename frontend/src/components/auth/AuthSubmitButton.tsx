import { Button } from '@/components/ui/button';

interface AuthSubmitButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const AuthSubmitButton = ({ label, onClick, className, disabled }: AuthSubmitButtonProps) => {
  return (
    <div className={ `w-full mb-[11.1px] ${className}` }>
      <Button
        onClick={ onClick }
        type={ onClick ? 'button' : 'submit' }
        disabled={ disabled }
        className="bg-[#4f46e5] text-white text-[14px] font-medium font-['Inter'] h-[41.99px] pt-[14.49px] pb-[15.23px] px-[23.25px] rounded-[8px] w-full hover:bg-[#4338ca] transition-colors mt-[4px] shadow-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        { label }
      </Button>
    </div>
  );
};
