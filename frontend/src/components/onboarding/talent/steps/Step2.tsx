import { StepHeader } from '../shared/StepHeader';
import { RutySpeechBubble } from '../shared/RutyAssistant';
import { RoleSelector } from '../shared/RoleSelector';
import { StackSelector } from '../shared/StackSelector';
import { ExperienceYearsSelector } from '../shared/ExperienceYearsSelector';
import { CvUploadSection } from '../shared/CvUploadSection';
import type { SkillRecord } from '@/lib/api/talent';

interface Step2Props {
  data: any;
  onUpdate: (newData: any) => void;
  errors?: Record<string, string>;
}

export function Step2({ data, onUpdate, errors = {} }: Step2Props) {
  const addSkill = (skill: SkillRecord) => {
    if (!data.stack.some((s: SkillRecord) => s.id === skill.id)) {
      onUpdate({ stack: [...data.stack, skill] });
    }
  };

  const removeSkill = (skillId: string) => {
    onUpdate({ stack: data.stack.filter((s: SkillRecord) => s.id !== skillId) });
  };

  return (
    <div className="flex flex-col items-start w-full animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      <StepHeader
        badge={ { text: 'Obligatorio', variant: 'obligatorio' } }
        title="¿En qué te especializás?"
        subtitle="Sin esto no podemos hacer tu diagnóstico — el examen se arma sobre tu rol."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-[16px] w-full mb-[32px] items-start">
        <RoleSelector
          role={ data.role }
          onRoleChange={ (role) => onUpdate({ role }) }
          error={ errors.role }
        />
        <div className="hidden lg:block">
          <RutySpeechBubble
            text="Elegí bien tu rol — el diagnóstico va a estar basado en esto."
          />
        </div>
      </div>

      <ExperienceYearsSelector
        value={ data.experience_years }
        onChange={ (v) => onUpdate({ experience_years: v }) }
      />

      <StackSelector
        stack={ data.stack }
        onAddSkill={ addSkill }
        onRemoveSkill={ removeSkill } error={ errors.stack } />

      <CvUploadSection
        file={ data.cv }
        skipCv={ data.skip_cv }
        onFileChange={ (file) => onUpdate({ cv: file }) }
        onSkipChange={ (skip) => onUpdate({ skip_cv: skip }) }
      />
    </div>
  );
}
