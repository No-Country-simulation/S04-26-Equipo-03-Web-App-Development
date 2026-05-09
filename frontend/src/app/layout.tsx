import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// import { Analytics } from '@vercel/analytics/next'
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'TalentBridge - Tu experiencia tiene un nivel',
  description:
    'Diagnóstico de habilidades por IA, ruta personalizada y matches con empresas que buscan talento senior real.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="bg-white">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        {/* {process.env.NODE_ENV === 'production' && <Analytics />} */}
      </body>
    </html>
  );
}
