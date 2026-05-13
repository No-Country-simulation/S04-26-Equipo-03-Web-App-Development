import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Link from 'next/link';
// import { useState } from "react";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  // const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <header className="bg-white border-b border-[#e5e5e5]">
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#1a1a2e] rounded-sm flex items-center justify-center text-white text-xs font-bold">
            TB
          </div>
          <span className="hidden sm:inline font-semibold text-[#1a1a2e]">
            TalentBridge
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          <Button className="text-sm text-[#4f46e5] bg-[#EEF2FF] font-normal px-4 py-2 rounded-md">
            Candidatos
          </Button>
          <Button className="text-sm text-[#1a1a2e] bg-white font-normal px-4 py-2 rounded-md">
            Mis guardados
          </Button>
          <Button className="text-sm text-[#1a1a2e] bg-white font-normal px-4 py-2 rounded-md">
            Mis posiciones
          </Button>
          <Button className="hidden sm:inline-flex text-sm text-[#1a1a2e] bg-[#E5E7EB] rounded-full p-2">
            MR
          </Button>
        </nav>
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-2 text-[#1a1a2e]"
          aria-label="Abrir filtros"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
