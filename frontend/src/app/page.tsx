import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Heart, Star } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Viewport Container */}
      <div className="min-h-[100dvh] flex flex-col">
        {/* Header */}
        <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#1a1a2e] rounded-md flex items-center justify-center">
            <span className="text-white text-xs font-bold">T</span>
          </div>
          <span className="font-semibold text-[#1a1a2e]">TalentBridge</span>
        </div>
        <nav className="flex items-center gap-6">
          <a href="#" className="text-sm text-[#1a1a2e] hover:text-[#1a1a2e]/80">
            Soy empresa
          </a>
          <a href="#" className="text-sm text-[#1a1a2e] hover:text-[#1a1a2e]/80">
            Iniciar sesión
          </a>
          <Button className="bg-[#4f46e5] hover:bg-[#4338ca] text-white text-sm px-4 py-2 h-auto rounded-md">
            Crear cuenta
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex-1 px-6 max-w-7xl mx-auto w-full flex items-center">
        <div className="grid lg:grid-cols-2 gap-12 items-start py-16 w-full">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-wider text-gray-500 font-medium">
              PARA PROFESIONALES 35–54
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold text-[#1a1a2e] leading-tight">
              Tu experiencia tiene un nivel.
              <br />
              Te ayudamos a demostrarlo.
            </h1>
            <p className="text-gray-600 text-base max-w-md">
              Diagnóstico de habilidades por IA, ruta personalizada y matches con
              empresas que buscan talento senior real.
            </p>
            <div className="flex items-center gap-3">
              <Button className="bg-[#1a1a2e] hover:bg-[#1a1a2e]/90 text-white px-6 py-2.5 h-auto rounded-md">
                Busco trabajo
              </Button>
              <Button
                variant="outline"
                className="border-gray-300 text-[#1a1a2e] px-6 py-2.5 h-auto rounded-md hover:bg-gray-50"
              >
                Busco talento
              </Button>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500 pt-2">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-gray-400" />
                <span>Sin spam de reclutadores</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-gray-400" />
                <span>Tu teléfono nunca se publica</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-gray-400" />
                <span>Gratis para postulantes</span>
              </div>
            </div>
          </div>

          {/* Profile Card */}
          <div className="flex justify-center lg:justify-end">
            <Card className="w-full max-w-sm p-5 shadow-lg border border-gray-100 rounded-xl">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                  MR
                </div>
                <div>
                  <h3 className="font-semibold text-[#1a1a2e]">Marcela R.</h3>
                  <p className="text-sm text-gray-500">Product Designer · Buenos Aires</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1 bg-[#4f46e5] text-white text-xs px-2.5 py-1 rounded-full">
                  <Check className="w-3 h-3" />
                  Semi-Senior
                </span>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-flex items-center gap-1 border border-[#4f46e5] text-[#4f46e5] text-xs px-2.5 py-1 rounded-full">
                  <Check className="w-3 h-3" />
                  Figma
                </span>
                <span className="inline-flex items-center gap-1 border border-[#4f46e5] text-[#4f46e5] text-xs px-2.5 py-1 rounded-full">
                  <Check className="w-3 h-3" />
                  Research
                </span>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                  Design Systems
                </span>
                <span className="text-xs text-gray-400">pendiente</span>
              </div>

              <div className="space-y-1 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-sm text-gray-600">Open to work · Remoto</span>
                </div>
                <p className="text-sm text-gray-500">
                  12 años exp. · Último: Sr Designer en —
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button className="flex-1 bg-[#1a1a2e] hover:bg-[#1a1a2e]/90 text-white text-sm py-2.5 h-auto rounded-md">
                  Ver perfil completo
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="border-gray-200 h-10 w-10 rounded-md"
                >
                  <Heart className="w-4 h-4 text-gray-400" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
      </div>

      {/* Cómo funciona */}
      <section className="bg-[#f8f8f8] px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-2">Cómo funciona</h2>
            <p className="text-gray-500">Dos caminos simétricos, una sola plataforma.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Si buscás trabajo */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-6">
                SI BUSCÁS TRABAJO
              </h3>
              <div className="space-y-4">
                {[
                  "Creá tu perfil en 4 pasos",
                  "Hacé el diagnóstico (15 min)",
                  "Recibí tu nivel validado y tu ruta",
                  "Postulate o esperá matches",
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-7 h-7 bg-[#1a1a2e] rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {index + 1}
                    </div>
                    <span className="text-[#1a1a2e]">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Si buscás talento */}
            <div>
              <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-6">
                SI BUSCÁS TALENTO
              </h3>
              <div className="space-y-4">
                {[
                  "Registrá tu empresa",
                  "Definí roles y stacks habituales",
                  "Filtrá candidatos con nivel validado",
                  "Contactá por email cuando quieras",
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-7 h-7 bg-[#1a1a2e] rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {index + 1}
                    </div>
                    <span className="text-[#1a1a2e]">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl lg:text-5xl font-bold text-[#1a1a2e]">12.4k</p>
              <p className="text-sm text-gray-500 mt-1">profesionales validados</p>
            </div>
            <div>
              <p className="text-4xl lg:text-5xl font-bold text-[#1a1a2e]">430+</p>
              <p className="text-sm text-gray-500 mt-1">empresas activas</p>
            </div>
            <div>
              <p className="text-4xl lg:text-5xl font-bold text-[#1a1a2e]">68%</p>
              <p className="text-sm text-gray-500 mt-1">de matches reciben respuesta</p>
            </div>
          </div>
        </div>
      </section>

      {/* Qué nos hace distintos */}
      <section className="bg-[#f8f8f8] px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-[#1a1a2e] text-center mb-12">
            Qué nos hace distintos
          </h2>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="p-6 bg-white border-0 shadow-sm rounded-xl">
              <div className="w-10 h-10 bg-[#1a1a2e] rounded-lg mb-4"></div>
              <h3 className="font-semibold text-[#1a1a2e] mb-2">Validación por skill</h3>
              <p className="text-sm text-gray-500">
                Cada habilidad se valida por separado. Tu seniority se deriva — no es el
                input.
              </p>
            </Card>

            <Card className="p-6 bg-white border-0 shadow-sm rounded-xl">
              <div className="w-10 h-10 bg-[#1a1a2e] rounded-lg mb-4"></div>
              <h3 className="font-semibold text-[#1a1a2e] mb-2">Ruta personalizada</h3>
              <p className="text-sm text-gray-500">
                No te decimos lo que te falta. Te mostramos tu próximo paso.
              </p>
            </Card>

            <Card className="p-6 bg-white border-0 shadow-sm rounded-xl">
              <div className="w-10 h-10 bg-[#1a1a2e] rounded-lg mb-4"></div>
              <h3 className="font-semibold text-[#1a1a2e] mb-2">Privacidad por diseño</h3>
              <p className="text-sm text-gray-500">
                Tu teléfono nunca aparece. Toggle de visibilidad para activar/pausar tu
                perfil.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Conocé a Cruty */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6 max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-[#e8e4ff] rounded-full flex items-center justify-center flex-shrink-0">
              <div className="text-4xl">:)</div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-500 font-medium mb-1">
                <span className="font-semibold text-[#1a1a2e]">CONOCÉ A CRUTY</span>{" "}
                <span className="text-gray-400">(nombre placeholder)</span>
              </p>
              <h3 className="text-lg font-semibold text-[#1a1a2e] mb-2">
                Te acompaña en cada paso del camino.
              </h3>
              <p className="text-sm text-gray-500">
                Te avisa cuando avanzás, te sugiere recursos según tu perfil, y te
                recuerda dónde te quedaste. Adulto y sobrio — no infantil.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1a1a2e] px-6 py-16">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
            Empezá hoy. Tomate 15 minutos.
          </h2>
          <p className="text-gray-400 mb-8">
            Tu próximo trabajo (o tu próximo hire) está a un diagnóstico de distancia.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button className="bg-[#4f46e5] hover:bg-[#4338ca] text-white px-6 py-2.5 h-auto rounded-md">
              Busco trabajo
            </Button>
            <Button
              variant="outline"
              className="border-gray-600 text-white px-6 py-2.5 h-auto rounded-md hover:bg-white/10 bg-transparent"
            >
              Busco talento
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a2e] px-6 py-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">TalentBridge</span>
          </div>
          <nav className="flex items-center gap-6">
            <a href="#" className="text-sm text-gray-400 hover:text-white">
              Producto
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white">
              Empresas
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white">
              Privacidad
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white">
              Términos
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white">
              Contacto
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
