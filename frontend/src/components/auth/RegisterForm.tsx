import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { AuthSeparator } from './AuthSeparator';
import { AuthInputField } from './AuthInputField';
import { SocialAuth } from './SocialAuth';
import { AuthCardFooter } from './AuthCardFooter';
import { AuthSubmitButton } from './AuthSubmitButton';
import { useRegisterTalent } from './useRegisterForm';

export const RegisterForm = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const { formData, isLoading, error, handleChange, register } = useRegisterTalent();

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

      <div className="w-full mb-[11.1px]">
        <SocialAuth />
      </div>

      <div className="w-full mb-[11.1px]">
        <AuthSeparator label="O" />
      </div>

      <form onSubmit={ register } className="w-full">
        { error && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md">
            { error }
          </div>
        ) }

        <div className="flex flex-col gap-[11.1px] w-full mb-[11.1px]">
          <AuthInputField
            label="Email"
            name="email"
            type="email"
            placeholder="vos@ejemplo.com"
            value={ formData.email }
            onChange={ handleChange }
          />

          <div className="flex flex-col gap-[6px] w-full">
            <AuthInputField
              label="Contraseña"
              name="password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              value={ formData.password }
              onChange={ handleChange }
            />
            <p className="text-[#6b7280] text-[12px] font-normal font-['Inter'] leading-[18px]">
              Al menos 8 caracteres, 1 mayúscula, 1 minúscula y 1 número.
            </p>
          </div>

          <AuthInputField
            label="Confirmar contraseña"
            name="confirmPassword"
            type="password"
            placeholder="Repetí la contraseña"
            value={ formData.confirmPassword }
            onChange={ handleChange }
          />
        </div>

        <div className="flex gap-[7.98px] items-center pt-[3.125px] w-full cursor-pointer mb-[11.1px]">
          <Checkbox
            id="remember-device"
            checked={ rememberMe }
            onCheckedChange={ (checked) => setRememberMe(checked as boolean) }
            className="border-[#4f46e5] border-[0.813px] data-[state=checked]:bg-[#4f46e5] data-[state=checked]:border-[#4f46e5] rounded-[2.439px] w-[13.01px] h-[13.823px] transition-none"
          />
          <label
            htmlFor="remember-device"
            className="text-[#374151] text-[13px] font-normal font-['Inter'] leading-[19.5px] cursor-pointer"
          >
            Recordar mi cuenta en este dispositivo
          </label>
        </div>

        <AuthSubmitButton
          label={ isLoading ? "Creando cuenta..." : "Crear cuenta" }
          disabled={ isLoading }
        />
      </form>

      <AuthCardFooter
        text="¿Ya tenés cuenta?"
        linkText="Iniciá sesión"
        href="/talent/login"
      />
    </Card>
  );
};
