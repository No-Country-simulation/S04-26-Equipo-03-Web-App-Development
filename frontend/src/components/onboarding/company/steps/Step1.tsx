'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface Step1Props {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
  onNext: () => void;
}

export function Step1({ data, onUpdate, onNext }: Step1Props) {
  const [form, setForm] = useState({
    companyName: (data.companyName as string) || '',
    website: (data.website as string) || '',
    industry: (data.industry as string) || '',
    size: (data.size as string) || '',
  });

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    onUpdate({ ...form, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1a1a2e]">
          Contanos sobre tu empresa
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Esta info aparece junto a las posiciones que publiques
        </p>
      </div>

      <div className="space-y-4">
        {/* Nombre de la empresa */}
        <div>
          <label className="block text-sm font-medium text-[#1a1a2e] mb-2">
            Nombre de la empresa
          </label>
          <Input
            type="text"
            placeholder="Acme Studio"
            value={form.companyName}
            onChange={(e) => updateField('companyName', e.target.value)}
            className="h-12 border-gray-200 rounded-md"
          />
        </div>

        {/* Sitio web */}
        <div>
          <label className="block text-sm font-medium text-[#1a1a2e] mb-2">
            Sitio web{' '}
            {/* <span className="text-gray-400 font-normal">(opcional)</span> */}
            <span>(opcional)</span>
          </label>
          <Input
            type="url"
            placeholder="https://acme.com"
            value={form.website}
            onChange={(e) => updateField('website', e.target.value)}
            className="h-12 border-gray-200 rounded-md"
          />
        </div>

        {/* Industria y Tamaño - 2 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Industria */}
          <div>
            <label className="block text-sm font-medium text-[#1a1a2e] mb-2">
              Industria
            </label>
            <Select
              value={form.industry}
              onValueChange={(value) => updateField('industry', value)}
            >
              <SelectTrigger className="h-12 px-3 py-6 border-gray-200 rounded-md w-full text-sm">
                <SelectValue placeholder="Elegir industria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tecnologia">Tecnología</SelectItem>
                <SelectItem value="finanzas">Finanzas</SelectItem>
                <SelectItem value="salud">Salud</SelectItem>
                <SelectItem value="educacion">Educación</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="manufactura">Manufactura</SelectItem>
                <SelectItem value="consultoria">Consultoría</SelectItem>
                <SelectItem value="otro">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tamaño de la empresa */}
          <div>
            <label className="block text-sm font-medium text-[#1a1a2e] mb-2">
              Tamaño de la empresa
            </label>
            <Select
              value={form.size}
              onValueChange={(value) => updateField('size', value)}
            >
              <SelectTrigger className="h-12 px-3 py-6 border-gray-200 rounded-md w-full text-sm">
                <SelectValue placeholder="11-50" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10">1-10 empleados</SelectItem>
                <SelectItem value="11-50">11-50 empleados</SelectItem>
                <SelectItem value="51-200">51-200 empleados</SelectItem>
                <SelectItem value="201-500">201-500 empleados</SelectItem>
                <SelectItem value="501-1000">501-1000 empleados</SelectItem>
                <SelectItem value="1000+">Más de 1000 empleados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Button
        onClick={onNext}
        className="w-full h-12 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-sm rounded-md"
      >
        Siguiente
      </Button>
    </div>
  );
}
