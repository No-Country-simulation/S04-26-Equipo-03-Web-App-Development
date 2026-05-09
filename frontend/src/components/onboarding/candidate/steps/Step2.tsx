import { StepHeader } from '../shared/StepHeader';
import { RutySpeechBubble } from '../shared/RutyAssistant';
import { RoleSelector } from '../shared/RoleSelector';
import { StackSelector } from '../shared/StackSelector';
import { RutyHelpCallout } from '../shared/RutyHelpCallout';

interface Step2Props {
  data: any;
  onUpdate: (newData: any) => void;
}

export function Step2({ data, onUpdate }: Step2Props) {
  const addTag = (tag: string) => {
    if (tag && !data.stack.includes(tag)) {
      onUpdate({ stack: [...data.stack, tag] });
    }
  };

  const removeTag = (tagToRemove: string) => {
    onUpdate({ stack: data.stack.filter((tag: string) => tag !== tagToRemove) });
  };

  return (
    <div className="flex flex-col items-start w-full animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      <StepHeader 
        badge={{ text: 'Obligatorio', variant: 'obligatorio' }}
        title="¿En qué te especializás?"
        subtitle="Sin esto no podemos hacer tu diagnóstico — el examen se arma sobre tu rol."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-[16px] w-full mb-[32px] items-start">
        <RoleSelector 
          role={data.role} 
          onRoleChange={(role) => onUpdate({ role })} 
        />
        <div className="hidden lg:block">
          <RutySpeechBubble 
            text="Elegí bien tu rol — el diagnóstico va a estar basado en esto."
          />
        </div>
      </div>

      <StackSelector 
        stack={data.stack}
        onAddTag={addTag}
        onRemoveTag={removeTag}
      />

      <RutyHelpCallout />
    </div>
  );
}
