'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function LoginPage() {
  const [isEmpresa, setIsEmpresa] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8f8f8]">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#1a1a2e] rounded-md flex items-center justify-center">
            <span className="text-white text-xs font-bold">T</span>
          </div>
          <span className="font-semibold text-[#1a1a2e]">TalentBridge</span>
        </Link>
        <Link href="/" className="text-sm text-gray-500 hover:text-[#1a1a2e]">
          Volver al inicio
        </Link>
      </header>

      {/* Login Card */}
      <div className="flex items-center justify-center px-6 py-16">
        <Card className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-xl shadow-sm">
          <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2">
            Iniciar sesión
          </h1>
          <p className="text-gray-500 mb-6">
            {isEmpresa
              ? 'Accedé al pool de talento validado.'
              : 'Recuperá tu progreso, tu ruta y tus matches.'}
          </p>

          {/* Solo para postulantes */}
          {!isEmpresa && (
            <>
              <div className="space-y-3 mb-6">
                <Button
                  variant="outline"
                  className="w-full h-12 border-gray-200 text-[#1a1a2e] rounded-md hover:bg-gray-50 flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continuar con Google
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12 border-gray-200 text-[#1a1a2e] rounded-md hover:bg-gray-50 flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#0A66C2">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  Continuar con LinkedIn
                </Button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-sm text-gray-400">O</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>
            </>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e] mb-2">
                {isEmpresa ? 'Email corporativo' : 'Email'}
              </label>
              <Input
                type="email"
                placeholder={
                  isEmpresa ? 'nombre@empresa.com' : 'vos@ejemplo.com'
                }
                className="h-12 border-gray-200 rounded-md"
              />
              {isEmpresa && (
                <p className="text-xs text-gray-500 mt-2">
                  No aceptamos cuentas personales (gmail, hotmail, yahoo, etc).
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1a1a2e] mb-2">
                Contraseña
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                className="h-12 border-gray-200 rounded-md"
              />
            </div>

            <a
              href="#"
              className="block text-sm text-[#4f46e5] hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </a>

            <Button className="w-full h-12 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-md mt-2">
              Iniciar sesión
            </Button>

            {isEmpresa ? (
              <>
                <Button
                  variant="outline"
                  className="w-full h-12 border-gray-200 text-[#1a1a2e] rounded-md hover:bg-gray-50"
                >
                  Crear cuenta de empresa
                </Button>
                <p className="text-sm text-gray-500 text-center mt-4">
                  ¿Sos administrador? Iniciá sesión con tu email corporativo —
                  te redirigimos al panel automáticamente.
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500 text-center mt-4">
                ¿No tenés cuenta?{' '}
                <a
                  href="#"
                  className="text-[#4f46e5] hover:underline font-medium"
                >
                  Registrate
                </a>
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
