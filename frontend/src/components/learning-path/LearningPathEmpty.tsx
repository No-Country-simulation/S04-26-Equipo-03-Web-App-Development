'use client';

import Link from 'next/link';
import { BookOpen, Sparkles } from 'lucide-react';

export function LearningPathEmpty() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-[24px] py-[64px] text-center">
      {/* Ilustración */ }
      <div className="w-[72px] h-[72px] bg-[#eef2ff] rounded-full flex items-center justify-center mb-[24px]">
        <BookOpen className="w-[32px] h-[32px] text-[#4f46e5]" />
      </div>

      <h2 className="text-[20px] font-semibold text-[#111827] mb-[8px]">
        Todavía no tenés una ruta de aprendizaje
      </h2>
      <p className="text-[14px] text-[#6b7280] max-w-[360px] mb-[32px] leading-[22px]">
        El diagnóstico inicial genera tu ruta personalizada. Podés hacerlo
        ahora o completar tu perfil primero.
      </p>

      <div className="flex flex-col sm:flex-row gap-[12px]">
        <Link
          href="/talent/pre-diagnostic"
          className="inline-flex items-center justify-center gap-[8px] bg-[#4f46e5] hover:bg-[#4338ca] text-white text-[14px] font-medium px-[20px] py-[10px] rounded-[8px] transition-colors"
        >
          <Sparkles className="w-[15px] h-[15px]" />
          Hacer el diagnóstico
        </Link>
        <Link
          href="/talent/onboarding"
          className="inline-flex items-center justify-center text-[14px] font-medium text-[#374151] hover:text-[#111827] border border-[#d1d5db] hover:border-[#9ca3af] px-[20px] py-[10px] rounded-[8px] transition-colors"
        >
          Completar mi perfil
        </Link>
      </div>
    </div>
  );
}
