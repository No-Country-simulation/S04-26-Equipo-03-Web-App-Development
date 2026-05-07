'use client';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useState } from 'react';
import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
  variant?: 'link' | 'button';
}

interface SiteHeaderProps {
  navItems?: NavItem[];
  rightContent?: React.ReactNode;
  showMobileMenu?: boolean;
  showLogo?: boolean;
}

function SiteLogo({
  href = '/',
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link href={href} className={`flex items-center gap-2 ${className}`}>
      <div className="w-7 h-7 bg-[#1a1a2e] rounded-md flex items-center justify-center">
        <span className="text-white text-xs font-bold">T</span>
      </div>
      <span className="font-semibold text-[#1a1a2e]">TalentBridge</span>
    </Link>
  );
}

export default function SiteHeader({
  navItems = [],
  rightContent,
  showMobileMenu = false,
  showLogo = true,
}: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="shrink-0 flex items-center justify-between px-4 sm:px-6 py-4 max-w-7xl mx-auto w-full">
      {showLogo ? <SiteLogo /> : rightContent}

      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-6">
        {navItems.map((item) =>
          item.variant === 'button' ? (
            <Button
              key={item.label}
              className="bg-[#4f46e5] hover:bg-[#4338ca] text-white text-sm px-4 py-2 h-auto rounded-md"
            >
              {item.label}
            </Button>
          ) : (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-[#1a1a2e] hover:text-[#1a1a2e]/80"
            >
              {item.label}
            </Link>
          )
        )}
        {rightContent}
      </nav>

      {/* Mobile Menu Toggle */}
      {showMobileMenu && (
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-[#1a1a2e]"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      )}

      {/* Mobile Nav */}
      {menuOpen && showMobileMenu && (
        <nav className="md:hidden px-4 sm:px-6 py-4 space-y-3">
          {navItems.map((item) =>
            item.variant === 'button' ? (
              <Button
                key={item.label}
                className="w-full bg-[#4f46e5] hover:bg-[#4338ca] text-white text-sm py-2.5 h-auto rounded-md"
              >
                {item.label}
              </Button>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className="block text-sm text-[#1a1a2e] py-2"
              >
                {item.label}
              </Link>
            )
          )}
          {rightContent && <div className="pt-2">{rightContent}</div>}
        </nav>
      )}
    </header>
  );
}
