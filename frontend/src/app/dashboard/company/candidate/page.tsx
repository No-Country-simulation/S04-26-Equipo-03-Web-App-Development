'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, Heart, ChevronLeft, Download } from 'lucide-react';
import Link from 'next/link';

export default function CandidateProfile() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1a1a2e] rounded-md flex items-center justify-center text-white text-xs font-bold">
              TB
            </div>
            <span className="font-bold text-[#1a1a2e]">TalentBridge</span>
          </div>
          <nav className="flex items-center gap-6 text-sm">
            <a href="#" className="text-[#1a1a2e] hover:text-[#1a1a2e]/80">
              Candidatos
            </a>
            <a href="#" className="text-[#1a1a2e] hover:text-[#1a1a2e]/80">
              Mis guardados
            </a>
            <a href="#" className="text-[#1a1a2e] hover:text-[#1a1a2e]/80">
              Mis posiciones
            </a>
            <a href="#" className="text-[#1a1a2e] hover:text-[#1a1a2e]/80">
              MR
            </a>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="flex items-center gap-1 text-sm text-[#1a1a2e] mb-6 hover:opacity-80"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver al dashboard
        </Link>

        <div className="grid grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Candidate Header */}
            <Card className="p-6 border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-[#1a1a2e] font-bold text-lg">
                  MR
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-[#1a1a2e]">
                    Marcela Rivero
                  </h1>
                  <p className="text-sm text-gray-600">
                    Product Designer · Buenos Aires, AR
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-gray-600">
                      Open to work · Remoto
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-3 flex-wrap">
                    <span className="bg-[#4f46e5] text-white px-3 py-1 rounded text-xs font-medium">
                      ✓ Semi-Senior
                    </span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4].map((i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-[#fbbf24] text-[#fbbf24]"
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">4.7 (8)</span>
                    <span className="bg-[#1a1a2e] text-white px-2 py-1 rounded text-xs">
                      ✓ 100% verificado
                    </span>
                    <span className="text-xs text-gray-600">12 años exp.</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Skills */}
            <Card className="p-6 border-gray-200">
              <h2 className="text-lg font-bold text-[#1a1a2e] mb-2">Skills</h2>
              <p className="text-sm text-gray-600 mb-4">
                Click en una skill para ver el detalle de la validación.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'Figma', level: 'Senior', count: '11' },
                  { name: 'Design Systems', level: 'Senior', count: '0' },
                  { name: 'User Research', level: 'Semi-Senior', count: '0' },
                  { name: 'Prototyping', level: 'Senior', count: '11' },
                  { name: 'Accessibility', level: 'Junior', count: '0' },
                  { name: 'Design Tokens', level: 'pendiente', count: '' },
                  { name: 'UX Writing', level: 'pendiente', count: '' },
                ].map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full text-sm"
                  >
                    <span className="text-gray-700">✓ {skill.name}</span>
                    {skill.level && (
                      <span className="text-xs text-gray-600">
                        · {skill.level}
                      </span>
                    )}
                    {skill.count && (
                      <span className="text-xs text-gray-600">
                        ({skill.count})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            {/* Reviews */}
            <Card className="p-6 border-gray-200">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-[#1a1a2e]">Reseñas</h2>
                <p className="text-sm text-gray-600">habilidades blandas</p>
              </div>
              <div className="flex items-baseline gap-4 mb-6">
                <div className="text-4xl font-bold text-[#1a1a2e]">4.7</div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i <= 4 ? 'fill-[#fbbf24] text-[#fbbf24]' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  8 reseñas verificadas
                </span>
              </div>
              <div className="space-y-4">
                {[
                  {
                    author: 'Lucía B.',
                    role: 'FintechCo · Reclutador / empleado',
                    review:
                      'Comunicación clara y productiva. Alineaba stakeholders sin perder tiempo del equipo.',
                  },
                  {
                    author: 'Pedro R.',
                    role: 'Compariers — Empresa A · Compañero de trabajo',
                    review:
                      'Excelente mentora. Genera espacio para que el equipo pruebe sin miedo.',
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="border-b border-gray-200 pb-4 last:border-0"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-sm text-[#1a1a2e]">
                          {item.author}
                        </p>
                        <p className="text-xs text-gray-600">{item.role}</p>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 fill-[#fbbf24] text-[#fbbf24]"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{item.review}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Resume */}
            <Card className="p-6 border-gray-200">
              <h2 className="text-lg font-bold text-[#1a1a2e] mb-4">Resumen</h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                12 años diseñando productos digitales para fintech y ecommerce.
                Especializada en design systems, research y mentoring de equipos
                junior.
              </p>
            </Card>

            {/* Experience */}
            <Card className="p-6 border-gray-200">
              <h2 className="text-lg font-bold text-[#1a1a2e] mb-6">
                Experiencia
              </h2>
              <div className="space-y-6">
                {[
                  {
                    title: 'Sr Product Designer',
                    company: 'Empresa A · 2023 – Presente',
                    years: '2 años',
                  },
                  {
                    title: 'Product Designer',
                    company: 'Empresa B · 2022 – 2023',
                    years: '1 año',
                  },
                  {
                    title: 'UX Designer',
                    company: 'Empresa C · 2020 – 2022',
                    years: '2 años',
                  },
                ].map((exp, i) => (
                  <div key={i}>
                    <h3 className="font-semibold text-[#1a1a2e] text-sm">
                      {exp.title}
                    </h3>
                    <p className="text-xs text-gray-600">{exp.company}</p>
                    <div className="mt-2 bg-gray-300 h-2 rounded-full"></div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Education */}
            <Card className="p-6 border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-[#1a1a2e]">Educación</h2>
                <a href="#" className="text-xs text-[#4f46e5] font-semibold">
                  + Agregar
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-[#1a1a2e]">
                  Lic. en Diseño Gráfico
                </h3>
                <p className="text-xs text-gray-600">UBA · 2008</p>
              </div>
            </Card>

            {/* Portfolio */}
            <Card className="p-6 border-gray-200">
              <h2 className="text-lg font-bold text-[#1a1a2e] mb-4">
                Portfolio
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-200 aspect-square rounded-lg flex items-center justify-center text-gray-500"
                  >
                    {i}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="col-span-1">
            <Card className="p-6 border-gray-200 sticky top-6">
              <Button className="w-full bg-[#4f46e5] hover:bg-[#4f46e5]/90 text-white font-semibold mb-4">
                Contactar
              </Button>
              <div className="flex gap-3 mb-6">
                <Button variant="outline" className="flex-1 border-gray-300">
                  <Heart className="w-4 h-4" />
                  Guardar
                </Button>
                <Button variant="outline" className="flex-1 border-gray-300">
                  Calificar
                </Button>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-[#1a1a2e] mb-3">
                  PROGRESO EN SU RUTA
                </h3>
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-[#1a1a2e]">
                      35%
                    </span>
                    <span className="text-xs text-gray-600">
                      Está actualizando sus habilidades
                    </span>
                  </div>
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#4f46e5] h-full w-[35%]"></div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full border-gray-300 text-[#4f46e5] mb-4"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar CV
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
