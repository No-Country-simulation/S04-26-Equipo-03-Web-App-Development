import { GoogleIcon, LinkedInIcon } from './SocialIcons';
import { SocialButton } from './SocialButton';

export const SocialAuth = () => {
  return (
    <div className="flex flex-col gap-[7.99px] pt-[8.9px] w-full">
      <SocialButton icon={<GoogleIcon />} label="Continuar con Google" />
      <SocialButton icon={<LinkedInIcon />} label="Continuar con LinkedIn" />
    </div>
  );
};
