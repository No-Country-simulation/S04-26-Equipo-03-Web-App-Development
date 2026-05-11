import { Card } from '@/components/ui/card';
import { AuthInputField } from './AuthInputField';
import { AuthCardFooter } from './AuthCardFooter';
import { AuthSubmitButton } from './AuthSubmitButton';

export const ForgotPasswordForm = () => {
  return (
    <Card className="bg-white border-[#e5e7eb] flex flex-col gap-0 items-start p-[29.25px] rounded-[10px] w-full max-w-[420px] shadow-[0px_1px_1px_rgba(17,24,39,0.06),0px_1px_1.5px_rgba(17,24,39,0.08)] border-solid">
      <div className="flex flex-col gap-[1.265px] w-full mb-[24px]">
        <h2 className="text-[#111827] text-[22px] font-bold font-['Inter'] leading-[26.4px] tracking-[-0.22px]">
          Recuperar contraseña
        </h2>
        <p className="text-[#6b7280] text-[13px] font-normal font-['Inter'] leading-[19.5px]">
          Ingresá tu email y te enviaremos las instrucciones para restablecer tu contraseña.
        </p>
      </div>

      <div className="flex flex-col gap-[15px] w-full mb-[24px]">
        <AuthInputField
          label="Email"
          type="email"
          placeholder="vos@ejemplo.com"
        />
      </div>

      <AuthSubmitButton label="Enviar instrucciones" />

      <AuthCardFooter 
        text="¿Te acordaste?" 
        linkText="Volver al login" 
        href="/login-talent" 
      />
    </Card>
  );
};
