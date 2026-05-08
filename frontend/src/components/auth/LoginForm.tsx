import { Card } from '@/components/ui/card';
import { AuthSeparator } from './AuthSeparator';
import { AuthInputField } from './AuthInputField';
import { AuthActionRow } from './AuthActionRow';
import { SocialAuth } from './SocialAuth';
import { AuthCardFooter } from './AuthCardFooter';
import { AuthSubmitButton } from './AuthSubmitButton';
import { useLoginForm } from './useLoginForm';

export const LoginForm = () => {
  const { isLoading, error, handleLogin } = useLoginForm();

  return (
    <Card className="bg-white border-[#e5e7eb] flex flex-col gap-0 items-start p-[29.25px] rounded-[10px] w-full max-w-[420px] shadow-[0px_1px_1px_rgba(17,24,39,0.06),0px_1px_1.5px_rgba(17,24,39,0.08)] border-solid">
      <form action={handleLogin} className="w-full">
        <div className="flex flex-col gap-[1.265px] w-full mb-[11.1px]">
          <h2 className="text-[#111827] text-[22px] font-bold font-['Inter'] leading-[26.4px] tracking-[-0.22px]">
            Iniciar sesión
          </h2>
          <p className="text-[#6b7280] text-[13px] font-normal font-['Inter'] leading-[19.5px]">
            Accedé a tu perfil y tu ruta.
          </p>
        </div>

        <div className="w-full mb-[11.1px]">
          <SocialAuth />
        </div>

        <div className="w-full mb-[11.1px]">
          <AuthSeparator />
        </div>

        <div className="flex flex-col gap-[15px] w-full mb-[11.1px]">
          <AuthInputField
            label="Email"
            name="email"
            type="email"
            placeholder="vos@ejemplo.com"
          />
          <div className="flex flex-col gap-[6px] w-full">
            <AuthInputField
              label="Contraseña"
              name="password"
              type="password"
              placeholder="••••••••"
            />
            <AuthActionRow />
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-[12px] mb-[11.1px] font-['Inter']">
            {error}
          </p>
        )}

        <AuthSubmitButton 
          label={isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'} 
          disabled={isLoading}
        />

        <AuthCardFooter 
          text="¿No tenés cuenta?" 
          linkText="Registrate" 
          href="/signup-talent" 
        />
      </form>
    </Card>
  );
};
