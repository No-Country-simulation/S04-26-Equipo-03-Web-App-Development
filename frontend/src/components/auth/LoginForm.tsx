import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { GoogleIcon, LinkedInIcon } from './SocialIcons';
import { SocialButton } from './SocialButton';
import { AuthSeparator } from './AuthSeparator';
import { AuthInputField } from './AuthInputField';
import { AuthActionRow } from './AuthActionRow';

export const LoginForm = () => {
  return (
    <Card className="bg-white border-[#e5e7eb] flex flex-col gap-0 items-start p-[29.25px] rounded-[10px] w-full max-w-[420px] shadow-[0px_1px_1px_rgba(17,24,39,0.06),0px_1px_1.5px_rgba(17,24,39,0.08)] border-solid">
      <div className="flex flex-col gap-[1.265px] w-full mb-[11.1px]">
        <h2 className="text-[#111827] text-[22px] font-bold font-['Inter'] leading-[26.4px] tracking-[-0.22px]">
          Iniciar sesión
        </h2>
        <p className="text-[#6b7280] text-[13px] font-normal font-['Inter'] leading-[19.5px]">
          Accedé a tu perfil y tu ruta.
        </p>
      </div>

      <div className="flex flex-col gap-[7.99px] pt-[8.9px] w-full mb-[11.1px]">
        <SocialButton icon={<GoogleIcon />} label="Continuar con Google" />
        <SocialButton icon={<LinkedInIcon />} label="Continuar con LinkedIn" />
      </div>

      <div className="w-full mb-[11.1px]">
        <AuthSeparator />
      </div>

      <div className="flex flex-col gap-[15px] w-full mb-[11.1px]">
        <AuthInputField
          label="Email"
          type="email"
          placeholder="vos@ejemplo.com"
        />
        <div className="flex flex-col gap-[6px] w-full">
          <AuthInputField
            label="Contraseña"
            type="password"
            placeholder="••••••••"
          />
          <AuthActionRow />
        </div>
      </div>

      <div className="w-full mb-[11.1px]">
        <Button className="bg-[#4f46e5] text-white text-[14px] font-medium font-['Inter'] h-[41.99px] pt-[14.49px] pb-[15.23px] px-[23.25px] rounded-[8px] w-full hover:bg-[#4338ca] transition-colors mt-[4px] shadow-none">
          Iniciar sesión
        </Button>
      </div>

      <div className="flex justify-center pt-[7.515px] w-full">
        <p className="text-[13px] font-normal font-['Inter'] leading-[19.5px] text-[#4b5563]">
          ¿No tenés cuenta?{' '}
          <Link
            href="/signup-candidate"
            className="text-[#4f46e5] font-medium hover:underline"
          >
            Registrate
          </Link>
        </p>
      </div>
    </Card>
  );
};
