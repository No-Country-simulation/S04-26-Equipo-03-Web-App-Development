import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { useState } from 'react';
import { GoogleIcon, LinkedInIcon } from './SocialIcons';
import { SocialButton } from './SocialButton';
import { AuthSeparator } from './AuthSeparator';
import { AuthInputField } from './AuthInputField';

export const RegisterForm = () => {
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <Card className="bg-white border-[#e5e7eb] flex flex-col gap-0 items-start p-[29.25px] rounded-[10px] w-full max-w-[420px] shadow-[0px_1px_1px_rgba(17,24,39,0.06),0px_1px_1.5px_rgba(17,24,39,0.08)] border-solid">
      <div className="flex flex-col gap-[1.265px] w-full mb-[11.1px]">
        <h2 className="text-[#111827] text-[22px] font-bold font-['Inter'] leading-[26.4px] tracking-[-0.22px]">
          Creá tu cuenta
        </h2>
        <p className="text-[#6b7280] text-[13px] font-normal font-['Inter'] leading-[19.5px]">
          15 minutos para tu primer diagnóstico.
        </p>
      </div>

      <div className="flex flex-col gap-[7.99px] pt-[8.9px] w-full mb-[11.1px]">
        <SocialButton icon={<GoogleIcon />} label="Continuar con Google" />
        <SocialButton icon={<LinkedInIcon />} label="Continuar con LinkedIn" />
      </div>

      <div className="w-full mb-[11.1px]">
        <AuthSeparator label="O" />
      </div>

      <div className="flex flex-col gap-[11.1px] w-full mb-[11.1px]">
        <AuthInputField
          label="Email"
          type="email"
          placeholder="vos@ejemplo.com"
        />
        
        <div className="flex flex-col gap-[6px] w-full">
          <AuthInputField
            label="Contraseña"
            type="password"
            placeholder="Mínimo 8 caracteres"
          />
          <p className="text-[#6b7280] text-[12px] font-normal font-['Inter'] leading-[18px]">
            Al menos 8 caracteres, 1 número.
          </p>
        </div>

        <AuthInputField
          label="Confirmar contraseña"
          type="password"
          placeholder="Repetí la contraseña"
        />
      </div>

      <div className="flex gap-[7.98px] items-center pt-[3.125px] w-full cursor-pointer mb-[11.1px]">
        <Checkbox
          id="remember-device"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          className="border-[#4f46e5] border-[0.813px] data-[state=checked]:bg-[#4f46e5] data-[state=checked]:border-[#4f46e5] rounded-[2.439px] w-[13.01px] h-[13.823px] transition-none"
        />
        <label
          htmlFor="remember-device"
          className="text-[#374151] text-[13px] font-normal font-['Inter'] leading-[19.5px] cursor-pointer"
        >
          Recordar mi cuenta en este dispositivo
        </label>
      </div>

      <div className="w-full mb-[11.1px]">
        <Button className="bg-[#4f46e5] text-white text-[14px] font-medium font-['Inter'] h-[41.99px] pt-[14.49px] pb-[15.23px] px-[23.25px] rounded-[8px] w-full hover:bg-[#4338ca] transition-colors mt-[4px] shadow-none">
          Crear cuenta
        </Button>
      </div>

      <div className="flex justify-center pt-[7.515px] w-full">
        <p className="text-[13px] font-normal font-['Inter'] leading-[19.5px] text-[#4b5563]">
          ¿Ya tenés cuenta?{' '}
          <Link
            href="/login-candidate"
            className="text-[#4f46e5] font-medium hover:underline"
          >
            Iniciá sesión
          </Link>
        </p>
      </div>
    </Card>
  );
};
