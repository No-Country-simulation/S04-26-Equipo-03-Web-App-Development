import { Briefcase, GraduationCap, Link as LinkIcon, User } from 'lucide-react';
import { useState } from 'react';
import { StepHeader } from '../shared/StepHeader';
import { AccordionItem } from '../shared/AccordionItem';
import { InfoBox } from '../shared/InfoBox';
import { ExperienceForm } from '../shared/ExperienceForm';
import { EducationForm } from '../shared/EducationForm';
import { PortfolioForm } from '../shared/PortfolioForm';
import { AboutMeForm } from '../shared/AboutMeForm';

interface Step3Props {
  data: any;
  onUpdate: (newData: any) => void;
}

export function Step3({ data, onUpdate }: Step3Props) {
  const [openSection, setOpenSection] = useState<string | null>('experience');

  const sections = [
    {
      id: 'experience',
      title: 'Experiencia laboral',
      subtitle: 'Empresa, rol, fechas. Podés agregar varias entradas.',
      icon: <Briefcase className="size-[18px]" />
    },
    {
      id: 'education',
      title: 'Educación',
      subtitle: 'Institución, título, año de graduación.',
      icon: <GraduationCap className="size-[18px]" />
    },
    {
      id: 'about',
      title: 'Descripción personal',
      subtitle: 'Una breve presentación que aparece en tu perfil.',
      icon: <User className="size-[18px]" />
    },
    {
      id: 'portfolio',
      title: 'Portafolio',
      subtitle: 'Subí un PDF o pegá un link — solo una de las dos opciones.',
      icon: <LinkIcon className="size-[18px]" />
    },
  ];

  const toggleSection = (id: string) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="flex flex-col items-start w-full animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      <StepHeader
        badge={ { text: 'Opcional', variant: 'opcional' } }
        title="Sumá detalles si querés"
        subtitle="Esto enriquece tu perfil pero no es necesario para empezar el diagnóstico. Podés completarlo cuando quieras desde tu perfil."
      />

      <div className="flex flex-col gap-[12px] w-full mb-[24px]">
        { sections.map((section) => (
          <AccordionItem
            key={ section.id }
            id={ section.id }
            title={ section.title }
            subtitle={ section.subtitle }
            isOpen={ openSection === section.id }
            onToggle={ () => toggleSection(section.id) }
          >
            { section.id === 'experience' && (
              <ExperienceForm
                value={ data.work_experience }
                onChange={ (v) => onUpdate({ work_experience: v }) }
              />
            ) }
            { section.id === 'education' && (
              <EducationForm
                value={ data.education }
                onChange={ (v) => onUpdate({ education: v }) }
              />
            ) }
            { section.id === 'about' && (
              <AboutMeForm
                value={ data.bio }
                onChange={ (v) => onUpdate({ bio: v }) }
              />
            ) }
            { section.id === 'portfolio' && (
              <PortfolioForm
                portfolioFile={ data.portfolio_file }
                portfolioUrl={ data.portfolio_url }
                onFileChange={ (f) => onUpdate({ portfolio_file: f }) }
                onUrlChange={ (url) => onUpdate({ portfolio_url: url }) }
              />
            ) }
          </AccordionItem>
        )) }
      </div>

      <InfoBox>
        Este paso no bloquea nada. Si lo dejás vacío, igual podés empezar el diagnóstico y completar tu perfil cuando tengas tiempo.
      </InfoBox>
    </div>
  );
}
